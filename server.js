require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json());

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    });

app.use(express.static(path.join(__dirname, "public")));

// ── COMICS ──
function sortComics(rows) {
  const groups = {};
  for (const c of rows) {
    const m = c.titulo.match(/^(.+)\s(\d+)$/);
    const base = m ? m[1] : c.titulo;
    const num  = m ? parseInt(m[2]) : null;
    if (!groups[base]) groups[base] = { maxId: 0, items: [] };
    if (c.id > groups[base].maxId) groups[base].maxId = c.id;
    groups[base].items.push({ ...c, _num: num });
  }
  return Object.values(groups)
    .sort((a, b) => b.maxId - a.maxId)
    .flatMap(g => g.items.sort((a, b) => (b._num ?? 0) - (a._num ?? 0)));
}

app.get("/api/comics", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, titulo, portada_url, sinopsis, escritor, dibujante, series,
              anio, genero, idioma, autor_url, traductor, tags
       FROM comics ORDER BY id DESC`,
    );
    res.json(sortComics(resultado.rows));
  } catch (error) {
    console.error("Error en /api/comics:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ── PÁGINAS ──
app.get("/api/comics/:id/paginas", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  try {
    const result = await pool.query(
      "SELECT * FROM paginas WHERE comic_id = $1 ORDER BY numero_pagina ASC",
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error en /api/comics/:id/paginas:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ── CORREO CON NODEMAILER (Gmail SMTP) ──
const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 3,
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function enviarCorreo(subject, htmlBody) {
  const email = process.env.CONTACT_EMAIL;
  if (!email || !process.env.GMAIL_APP_PASSWORD) throw new Error("Credenciales de correo no configuradas");
  await mailer.sendMail({
    from: `"H4ALL Comics" <${email}>`,
    to: email,
    subject,
    html: htmlBody,
  });
}

app.post("/api/contacto", (req, res) => {
  const { titulo, autor, enlace, sinopsis } = req.body;
  if (!titulo || !autor || !enlace) return res.status(400).json({ error: "Campos requeridos" });
  res.json({ ok: true });
  enviarCorreo(
    "🚨 H4All Comics — Nueva propuesta de cómic",
    `<h2>Nueva propuesta de cómic</h2>
     <p><b>Título:</b> ${titulo}</p>
     <p><b>Autor:</b> ${autor}</p>
     <p><b>Enlace:</b> <a href="${enlace}">${enlace}</a></p>
     <p><b>Sinopsis:</b> ${sinopsis || "—"}</p>`
  ).catch(e => console.error("Error /api/contacto:", e.message));
});

app.post("/api/soporte", (req, res) => {
  const { tipo, mensaje } = req.body;
  if (!mensaje) return res.status(400).json({ error: "Mensaje requerido" });
  res.json({ ok: true });
  enviarCorreo(
    "Soporte H4ALL",
    `<h2>Mensaje de soporte</h2>
     <p><b>Tipo:</b> ${tipo || "Sin tipo"}</p>
     <p><b>Mensaje:</b> ${mensaje}</p>`
  ).catch(e => console.error("Error /api/soporte:", e.message));
});

// ── SPA fallback — rutas API no encontradas devuelven 404, resto sirve el SPA ──
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Endpoint no encontrado" });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ══════════════════════════════════════════
//  MIGRACIÓN INTEGRADA
// ══════════════════════════════════════════
const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function limpiar(valor) {
  if (valor === null || valor === undefined) return null;
  const v = typeof valor === "object" ? valor["#text"] || "" : String(valor);
  const limpio = v.trim();
  return limpio && limpio.toLowerCase() !== "nothing" ? limpio : null;
}

async function sincronizarCatalogo() {
  const jsonPath = "./nuevos_comics.json";
  if (!fs.existsSync(jsonPath)) {
    console.log("⚠ No se encontró nuevos_comics.json. Saltando sincronización.");
    return;
  }

  const nuevosComics = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  console.log(`\n📚 Sincronizando ${nuevosComics.length} cómics...`);

  for (const comic of nuevosComics) {
    console.log(`  → "${comic.titulo}"`);

    let sinopsis  = "Sin descripción disponible.";
    let escritor  = "Desconocido";
    let dibujante = null;
    let series    = null;
    let anio      = null;
    let genero    = "Varios";
    let idioma    = "N/A";
    let autor_url = null;
    let traductor = null;
    let tags      = null;

    if (comic.xml_url) {
      try {
        const respuesta = await fetch(comic.xml_url);
        const xmlTexto  = await respuesta.text();
        const info      = xmlParser.parse(xmlTexto).ComicInfo;
        if (info) {
          sinopsis  = limpiar(info.Summary)     || sinopsis;
          escritor  = limpiar(info.Writer)      || escritor;
          dibujante = limpiar(info.Penciller);
          series    = limpiar(info.Series);
          anio      = info.Year                 ? parseInt(info.Year) : null;
          genero    = limpiar(info.Genre)       || genero;
          idioma    = limpiar(info.LanguageISO) || idioma;
          traductor = limpiar(info.Traductor);
          tags      = limpiar(info.Tags);
          const urlMatch = String(info.Notes || "").match(/https?:\/\/[^\s]+/);
          autor_url = urlMatch ? urlMatch[0] : null;
        }
      } catch (err) {
        console.log(`    ⚠ XML no procesado: ${err.message}`);
      }
    }

    // Cada cómic en su propia transacción para evitar race conditions
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const check = await client.query(
        "SELECT id FROM comics WHERE titulo = $1 FOR UPDATE",
        [comic.titulo]
      );
      let comicId;

      if (check.rows.length > 0) {
        comicId = check.rows[0].id;
        await client.query(
          `UPDATE comics SET sinopsis=$1, escritor=$2, dibujante=$3, series=$4, anio=$5,
           genero=$6, idioma=$7, autor_url=$8, traductor=$9, tags=$10 WHERE id=$11`,
          [sinopsis, escritor, dibujante, series, anio, genero, idioma, autor_url, traductor, tags, comicId]
        );
        console.log(`    ✓ Actualizado (ID: ${comicId})`);
      } else {
        const res = await client.query(
          `INSERT INTO comics (titulo, portada_url, sinopsis, escritor, dibujante, series,
                               anio, genero, idioma, autor_url, traductor, tags)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
          [comic.titulo, comic.portada_url, sinopsis, escritor, dibujante, series,
           anio, genero, idioma, autor_url, traductor, tags]
        );
        comicId = res.rows[0].id;
        console.log(`    ✓ Insertado (ID: ${comicId})`);
      }

      for (let numeroPagina = 1; numeroPagina <= comic.paginas.length; numeroPagina++) {
        const checkP = await client.query(
          "SELECT id FROM paginas WHERE comic_id=$1 AND numero_pagina=$2",
          [comicId, numeroPagina]
        );
        if (checkP.rows.length === 0) {
          await client.query(
            "INSERT INTO paginas (comic_id, numero_pagina, imagen_url) VALUES ($1,$2,$3)",
            [comicId, numeroPagina, comic.paginas[numeroPagina - 1]]
          );
        }
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(`    ❌ Error en "${comic.titulo}" (rollback):`, err.message);
    } finally {
      client.release();
    }
  }
  console.log("✅ Sincronización completada.\n");
}

// ── ARRANQUE — servidor inicia de inmediato, sync corre en background ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  sincronizarCatalogo().catch(err =>
    console.error("⚠ Error en sincronización (servidor activo):", err.message)
  );
});
