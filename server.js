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
    res.status(500).json({ error: error.message });
  }
});

// ── PÁGINAS ──
app.get("/api/comics/:id/paginas", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM paginas WHERE comic_id = $1 ORDER BY numero_pagina ASC",
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error en servidor:", err.message);
    res.status(500).json({ error: err.message });
  }
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

    const check = await pool.query("SELECT id FROM comics WHERE titulo = $1", [comic.titulo]);
    let comicId;

    if (check.rows.length > 0) {
      comicId = check.rows[0].id;
      await pool.query(
        `UPDATE comics SET sinopsis=$1, escritor=$2, dibujante=$3, series=$4, anio=$5,
         genero=$6, idioma=$7, autor_url=$8, traductor=$9, tags=$10 WHERE id=$11`,
        [sinopsis, escritor, dibujante, series, anio, genero, idioma, autor_url, traductor, tags, comicId]
      );
      console.log(`    ✓ Actualizado (ID: ${comicId})`);
    } else {
      const res = await pool.query(
        `INSERT INTO comics (titulo, portada_url, sinopsis, escritor, dibujante, series,
                             anio, genero, idioma, autor_url, traductor, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id;`,
        [comic.titulo, comic.portada_url, sinopsis, escritor, dibujante, series,
         anio, genero, idioma, autor_url, traductor, tags]
      );
      comicId = res.rows[0].id;
      console.log(`    ✓ Insertado (ID: ${comicId})`);
    }

    let numeroPagina = 1;
    for (const urlPagina of comic.paginas) {
      const checkP = await pool.query(
        "SELECT id FROM paginas WHERE comic_id=$1 AND numero_pagina=$2",
        [comicId, numeroPagina]
      );
      if (checkP.rows.length === 0) {
        await pool.query(
          "INSERT INTO paginas (comic_id, numero_pagina, imagen_url) VALUES ($1,$2,$3);",
          [comicId, numeroPagina, urlPagina]
        );
      }
      numeroPagina++;
    }
  }
  console.log("✅ Sincronización completada.\n");
}

// ── SPA fallback ──
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── ARRANQUE ──
sincronizarCatalogo()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error en sincronización:", err.message);
    process.exit(1);
  });
