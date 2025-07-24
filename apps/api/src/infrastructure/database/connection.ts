import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// Lade die richtige .env Datei
const envFile =
  (process.env.NODE_ENV as string) === "docker" ? ".env.docker" : ".env.local";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Fallback auf .env wenn spezifische Datei nicht existiert
if (!process.env.DB_HOST) {
  dotenv.config();
}

// Jetzt erst den Pool erstellen
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // Fallback zu localhost
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "fanini",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "fanini_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Debug-Ausgabe
console.log("🔌 Database connection config:", {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "3306",
  user: process.env.DB_USER || "fanini",
  database: process.env.DB_NAME || "fanini_db",
});

// Test-Funktion um zu prüfen ob die Verbindung funktioniert
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Datenbankverbindung erfolgreich!");

    // Teste eine einfache Abfrage
    const [rows] = await connection.query("SELECT 1 as test");
    console.log("✅ Test-Query erfolgreich:", rows);

    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Datenbankverbindung fehlgeschlagen:", error);
    return false;
  }
}

// Hilfsfunktion für Queries
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    console.error("Query Error:", error);
    throw error;
  }
}
