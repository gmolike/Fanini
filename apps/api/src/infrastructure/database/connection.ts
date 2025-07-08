import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Lade Umgebungsvariablen
dotenv.config();

// Erstelle einen Pool von Verbindungen
// Ein Pool ist wie mehrere Telefonleitungen - mehrere Anfragen können gleichzeitig bearbeitet werden
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
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
