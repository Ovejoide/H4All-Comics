require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
      ssl: false,
    });

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function limpiar(valor) {
  if (valor === null || valor === undefined) return null;
  // Si el parser devuelve un objeto (nodo con atributos), extraer #text
  const v = typeof valor === "object" ? valor["#text"] || "" : String(valor);
  const limpio = v.trim();
  return limpio && limpio.toLowerCase() !== "nothing" ? limpio : null;
}

async function importarCatalogo() {
  try {
    if (!fs.existsSync("./nuevos_comics.json")) {
      throw new Error(
        "No se encontró el archivo 'nuevos_comics.json' en la raíz del proyecto.",
      );
    }

    const datosRaw = fs.readFileSync("./nuevos_comics.json", "utf-8");
    const nuevosComics = JSON.parse(datosRaw);

    console.log(
      `>> Se encontraron ${nuevosComics.length} cómics para procesar.`,
    );

    for (const comic of nuevosComics) {
      console.log(`\nProcesando: "${comic.titulo}"...`);

      let sinopsis = "Sin descripción disponible.";
      let escritor = "Desconocido";
      let anio = null;
      let genero = "Varios";
      let idioma = "N/A";
      let autor_url = null;
      let traductor = null;
      let tags = null;

      if (comic.xml_url) {
        try {
          console.log(`Descargando metadatos XML...`);
          const respuesta = await fetch(comic.xml_url);
          const xmlTexto = await respuesta.text();
          const parseado = xmlParser.parse(xmlTexto);
          const info = parseado.ComicInfo;

          if (info) {
            sinopsis = limpiar(info.Summary) || sinopsis;
            escritor = limpiar(info.Writer) || escritor;
            anio = info.Year ? parseInt(info.Year) : null;
            genero = limpiar(info.Genre) || genero;
            idioma = limpiar(info.LanguageISO) || idioma;
            traductor = limpiar(info.Traductor);
            tags = limpiar(info.Tags);

            // Extraer URL desde el campo Notes
            const notes = String(info.Notes || "");
            const urlMatch = notes.match(/https?:\/\/[^\s]+/);
            autor_url = urlMatch ? urlMatch[0] : null;
          }

          console.log(
            `✓ Metadatos: ${escritor} (${anio}) [${idioma}]${traductor ? ` | Trad: ${traductor}` : ""}${autor_url ? ` | ${autor_url}` : ""}`,
          );
        } catch (err) {
          console.log(
            `⚠ Error al procesar el XML: ${err.message}. Se usarán valores por defecto.`,
          );
        }
      }

      // ── Control de duplicados ──
      const checkComic = await pool.query(
        "SELECT id FROM comics WHERE titulo = $1",
        [comic.titulo],
      );
      let nuevoComicId;

      if (checkComic.rows.length > 0) {
        nuevoComicId = checkComic.rows[0].id;
        await pool.query(
          `UPDATE comics
           SET sinopsis=$1, escritor=$2, anio=$3, genero=$4, idioma=$5, autor_url=$6, traductor=$7, tags=$8
           WHERE id=$9`,
          [
            sinopsis,
            escritor,
            anio,
            genero,
            idioma,
            autor_url,
            traductor,
            tags,
            nuevoComicId,
          ],
        );
        console.log(
          `⚠ Cómic ya existe (ID: ${nuevoComicId}). Metadatos actualizados.`,
        );
      } else {
        const resComic = await pool.query(
          `INSERT INTO comics (titulo, portada_url, sinopsis, escritor, anio, genero, idioma, autor_url, traductor, tags)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
           RETURNING id;`,
          [
            comic.titulo,
            comic.portada_url,
            sinopsis,
            escritor,
            anio,
            genero,
            idioma,
            autor_url,
            traductor,
            tags,
          ],
        );
        nuevoComicId = resComic.rows[0].id;
        console.log(`✓ Cómic registrado (ID: ${nuevoComicId})`);
      }

      // ── Páginas con control de duplicados ──
      let numeroPagina = 1;
      for (const urlPagina of comic.paginas) {
        const checkPagina = await pool.query(
          "SELECT id FROM paginas WHERE comic_id=$1 AND numero_pagina=$2",
          [nuevoComicId, numeroPagina],
        );
        if (checkPagina.rows.length === 0) {
          await pool.query(
            "INSERT INTO paginas (comic_id, numero_pagina, imagen_url) VALUES ($1,$2,$3);",
            [nuevoComicId, numeroPagina, urlPagina],
          );
        }
        numeroPagina++;
      }
      console.log(`✓ Páginas sincronizadas para el ID ${nuevoComicId}.`);
    }

    console.log("\n>>> ¡Proceso de sincronización terminado con éxito! <<<");
  } catch (error) {
    console.error("❌ Error durante la migración:", error.message);
  } finally {
    await pool.end();
  }
}

importarCatalogo();
