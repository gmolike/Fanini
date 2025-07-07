import { pool } from "./connection";
import fs from "fs/promises";
import path from "path";

async function runMigrations() {
  console.log("🚀 Starte Datenbank-Migration...\n");

  try {
    // Lese die SQL-Datei
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "001_create_tables.sql",
    );
    const sqlContent = await fs.readFile(migrationPath, "utf-8");

    console.log("📄 Migration-Datei gelesen, Länge:", sqlContent.length);

    // Entferne Kommentare und leere Zeilen für bessere Verarbeitung
    const cleanedSql = sqlContent
      .split("\n")
      .filter((line) => !line.trim().startsWith("--") && line.trim().length > 0)
      .join("\n");

    // Teile in einzelne Statements (bei Semikolon, aber nicht in Strings)
    const statements = cleanedSql
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`📊 Gefundene SQL-Statements: ${statements.length}\n`);

    // Führe jedes Statement einzeln aus
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Zeige ersten Teil des Statements
      const preview = statement.substring(0, 60).replace(/\n/g, " ");
      console.log(
        `📝 [${i + 1}/${statements.length}] Führe aus: ${preview}...`,
      );

      try {
        await pool.query(statement);
        console.log(`   ✅ Erfolgreich`);
      } catch (error: any) {
        console.error(`   ❌ Fehler: ${error.message}`);
        // Bei kritischen Fehlern abbrechen
        if (!error.message.includes("already exists")) {
          throw error;
        }
      }
    }

    console.log("\n✅ Migration erfolgreich abgeschlossen!");

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
