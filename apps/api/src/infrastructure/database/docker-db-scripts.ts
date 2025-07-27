// apps/api/src/infrastructure/database/docker-db-scripts.ts
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTAINER_NAME = "faninitiative-mysql-1"; // oder "mysql" je nach docker-compose

// Hilfsfunktion: Warte auf MySQL
async function waitForMySQL(maxAttempts = 30) {
  console.log("⏳ Waiting for MySQL to be ready...");

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await execAsync(
        `docker exec ${CONTAINER_NAME} mysql -u fanini -ppassword -e "SELECT 1"`
      );
      console.log("✅ MySQL is ready!");
      return true;
    } catch {
      process.stdout.write(".");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error("MySQL failed to start within timeout");
}

// Migration ausführen
export async function dockerMigrate() {
  console.log("🐳 Running Migration in Docker...\n");

  try {
    await waitForMySQL();

    // Kopiere Migration in Container
    const migrationPath = path.join(__dirname, "migrations", "001_complete_schema_clean.sql");

    console.log("📋 Copying migration to container...");
    await execAsync(
      `docker cp "${migrationPath}" ${CONTAINER_NAME}:/tmp/migration.sql`
    );

    // Führe Migration aus
    console.log("🔄 Executing migration...");
    await execAsync(
      `docker exec ${CONTAINER_NAME} mysql -u fanini -ppassword fanini_db < /tmp/migration.sql`
    );

    console.log("✅ Migration completed!");
  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

// Seeds ausführen
export async function dockerSeed() {
  console.log("🐳 Running Seeds in Docker...\n");

  try {
    await waitForMySQL();

    // Führe Seeds im Backend Container aus
    console.log("🌱 Executing seeds...");
    await execAsync(
      `docker exec faninitiative-backend-1 pnpm run seed:internal`
    );

    console.log("✅ Seeding completed!");
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

// Datenbank zurücksetzen
export async function dockerReset() {
  console.log("🐳 Resetting Database in Docker...\n");

  try {
    await waitForMySQL();

    // Drop und Create Database
    console.log("🗑️  Dropping database...");
    await execAsync(
      `docker exec ${CONTAINER_NAME} mysql -u fanini -ppassword -e "DROP DATABASE IF EXISTS fanini_db"`
    );

    console.log("✨ Creating database...");
    await execAsync(
      `docker exec ${CONTAINER_NAME} mysql -u fanini -ppassword -e "CREATE DATABASE fanini_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"`
    );

    // Migration ausführen
    await dockerMigrate();

    console.log("\n✅ Database reset completed!");
  } catch (error: any) {
    console.error("❌ Reset failed:", error.message);
    process.exit(1);
  }
}

// CLI Handler
const command = process.argv[2];

switch (command) {
  case "migrate":
    dockerMigrate();
    break;
  case "seed":
    dockerSeed();
    break;
  case "reset":
    dockerReset();
    break;
  case "fresh":
    dockerReset().then(() => dockerSeed());
    break;
  default:
    console.log("Usage: tsx docker-db-scripts.ts [migrate|seed|reset|fresh]");
}
