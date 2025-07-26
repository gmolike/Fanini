// apps/api/src/infrastructure/database/migrate.ts
import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log("🚀 Starting database migration...\n");

  // Direkte Verbindung statt Pool
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "fanini",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "fanini_db",
    multipleStatements: true,
  });

  try {
    console.log("✅ Database connection successful\n");

    // Check existing tables
    const [tables] = await connection.execute("SHOW TABLES");
    console.log(`📊 Found ${(tables as any[]).length} existing tables\n`);

    // Read migration file
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "001_complete_schema.sql",
    );
    console.log(`📁 Reading migration from: ${migrationPath}`);

    const sqlContent = await fs.readFile(migrationPath, "utf-8");
    console.log(`✅ Migration file read (${sqlContent.length} characters)\n`);

    // Execute the entire migration
    console.log("🔄 Executing migration...");
    await connection.query(sqlContent);

    console.log("\n✅ Migration completed successfully!");
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      console.log("⚠️  Some tables already exist, but that's OK");
    } else {
      console.error("\n❌ Migration failed:", error.message);
      throw error;
    }
  } finally {
    await connection.end();
    console.log("🔌 Connection closed");
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default runMigrations;
