// apps/api/src/infrastructure/database/migrate.ts
import { pool } from "./connection";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ES Module Ersatz für __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log("🚀 Starte Datenbank-Migration...\n");

  try {
    // Lese alle SQL-Dateien aus dem migrations Ordner
    const migrationsDir = path.join(__dirname, "migrations");
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

    console.log(`📋 Gefundene Migrations: ${sqlFiles.length}\n`);

    for (const file of sqlFiles) {
      console.log(`📄 Führe Migration aus: ${file}`);

      const migrationPath = path.join(migrationsDir, file);
      const sqlContent = await fs.readFile(migrationPath, "utf-8");

      // Entferne Kommentare und leere Zeilen
      const cleanedSql = sqlContent
        .split("\n")
        .filter(
          (line) => !line.trim().startsWith("--") && line.trim().length > 0,
        )
        .join("\n");

      // Teile in einzelne Statements
      const statements = cleanedSql
        .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      console.log(`   📊 Statements: ${statements.length}`);

      // Führe jedes Statement aus
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];

        try {
          await pool.query(statement);
          console.log(
            `   ✅ Statement ${i + 1}/${statements.length} erfolgreich`,
          );
        } catch (error: any) {
          if (error.message.includes("already exists")) {
            console.log(
              `   ⚠️  Statement ${i + 1}/${statements.length} - Bereits vorhanden`,
            );
          } else {
            console.error(
              `   ❌ Statement ${i + 1}/${statements.length} - Fehler: ${error.message}`,
            );
            throw error;
          }
        }
      }

      console.log(`   ✅ Migration ${file} abgeschlossen\n`);
    }

    console.log("✅ Alle Migrationen erfolgreich abgeschlossen!");

    // Zeige Tabellen zur Kontrolle
    const [tables] = await pool.query("SHOW TABLES");
    console.log("\n📋 Erstellte Tabellen:");
    (tables as any[]).forEach((table) => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
  } catch (error) {
    console.error("\n❌ Migration fehlgeschlagen:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Führe die Migration aus
runMigrations();
