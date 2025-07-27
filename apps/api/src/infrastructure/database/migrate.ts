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

    // Get migrations directory
    const migrationsDir = path.join(__dirname, "migrations");

    // Read all migration files
    const migrationFiles = await fs.readdir(migrationsDir);

    // Filter SQL files and sort them
    const sqlFiles = migrationFiles
      .filter((file) => file.endsWith(".sql"))
      .sort(); // This will sort them alphabetically (001_, 002_, etc.)

    console.log(`📁 Found ${sqlFiles.length} migration files:\n`);
    sqlFiles.forEach((file) => console.log(`   - ${file}`));
    console.log();

    // Execute each migration in order
    for (const file of sqlFiles) {
      const migrationPath = path.join(migrationsDir, file);

      console.log(`\n🔄 Running migration: ${file}`);
      console.log(`   Path: ${migrationPath}`);

      try {
        // Read the migration file
        const sqlContent = await fs.readFile(migrationPath, "utf-8");
        console.log(`   Size: ${sqlContent.length} characters`);

        // Skip empty files
        if (sqlContent.trim().length === 0) {
          console.log(`   ⚠️  Skipping empty migration file`);
          continue;
        }

        // Execute the migration
        await connection.query(sqlContent);
        console.log(`   ✅ ${file} completed successfully`);
      } catch (error: any) {
        // Handle specific errors
        if (error.code === "ER_TABLE_EXISTS_ERROR") {
          console.log(
            `   ⚠️  Some tables already exist in ${file}, continuing...`,
          );
        } else if (error.code === "ER_DUP_ENTRY") {
          console.log(
            `   ⚠️  Some entries already exist in ${file}, continuing...`,
          );
        } else if (error.code === "ER_CANT_DROP_FIELD_OR_KEY") {
          console.log(
            `   ⚠️  Column/constraint doesn't exist in ${file}, continuing...`,
          );
        } else {
          console.error(`   ❌ ${file} failed:`, error.message);
          console.error(`   Error code: ${error.code}`);
          console.error(`   SQL State: ${error.sqlState}`);

          // Don't stop on non-critical errors
          if (
            error.code === "ER_BAD_DB_ERROR" ||
            error.code === "ER_PARSE_ERROR"
          ) {
            throw error; // Critical errors
          }
        }
      }
    }

    // Final check
    const [finalTables] = await connection.execute("SHOW TABLES");
    console.log(
      `\n📊 Migration complete! Now have ${(finalTables as any[]).length} tables`,
    );

    // Show table list
    console.log("\n📋 Tables in database:");
    (finalTables as any[]).forEach((table) => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

    console.log("\n✅ All migrations completed successfully!");
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error.message);
    throw error;
  } finally {
    await connection.end();
    console.log("\n🔌 Connection closed");
  }
}

// Helper function to check if we should run a specific migration
async function shouldRunMigration(
  connection: mysql.Connection,
  migrationName: string,
): Promise<boolean> {
  // You could implement a migrations table to track which migrations have been run
  // For now, we'll just try to run everything and handle errors
  return true;
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
