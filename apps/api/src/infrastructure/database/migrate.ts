// apps/api/src/infrastructure/database/migrate.ts
import { pool } from "./connection";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log("🚀 Starting database migration...\n");

  try {
    // Single consolidated migration
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "001_complete_schema.sql",
    );
    const sqlContent = await fs.readFile(migrationPath, "utf-8");

    // Split by semicolon but respect strings
    const statements = sqlContent
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📊 Found ${statements.length} statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      try {
        await pool.query(statements[i]);
        console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
      } catch (error: any) {
        if (error.message.includes("already exists")) {
          console.log(`⚠️  Statement ${i + 1} - Already exists, skipping`);
        } else {
          console.error(`❌ Statement ${i + 1} failed:`, error.message);
          throw error;
        }
      }
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}
