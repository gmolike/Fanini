// apps/api/src/infrastructure/database/resetDatabase.ts
import { pool } from "./connection";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDatabase() {
  console.log("🔄 Starte Datenbank Reset...\n");

  try {
    // 1. Verbindung zur Datenbank herstellen (ohne spezifische DB)
    const connection = await pool.getConnection();

    // 2. Datenbank löschen und neu erstellen
    console.log("🗑️  Lösche existierende Datenbank...");
    await connection.query("DROP DATABASE IF EXISTS fanini_db");

    console.log("✨ Erstelle neue Datenbank...");
    await connection.query(
      "CREATE DATABASE fanini_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    );

    connection.release();

    // 3. Migration ausführen
    console.log("\n📋 Führe Migration aus...");
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "001_complete_schema.sql",
    );

    // MySQL-Befehl mit Umgebungsvariablen
    const mysqlCommand = `mysql -h ${process.env.DB_HOST || "localhost"} -P ${process.env.DB_PORT || "3306"} -u ${process.env.DB_USER || "fanini"} -p${process.env.DB_PASSWORD || "password"} fanini_db < "${migrationPath}"`;

    try {
      await execAsync(mysqlCommand);
      console.log("✅ Migration erfolgreich ausgeführt");
    } catch (error) {
      console.error("❌ Fehler bei der Migration:", error);
      throw error;
    }

    // 4. Seed-Daten einfügen
    console.log("\n🌱 Füge Seed-Daten ein...");
    const seedModule = await import("./seed/seedComplete.js");
    await seedModule.seedCompleteDatabase();

    console.log("\n✅ Datenbank-Reset erfolgreich abgeschlossen!");
  } catch (error) {
    console.error("\n❌ Fehler beim Datenbank-Reset:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Führe Reset aus wenn direkt aufgerufen
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetDatabase()
    .then(() => {
      console.log("\n✅ Reset abgeschlossen");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Reset fehlgeschlagen:", error);
      process.exit(1);
    });
}

export { resetDatabase };
