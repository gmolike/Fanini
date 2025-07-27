// apps/api/src/infrastructure/database/docker-migrate.ts
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function dockerMigrate() {
  console.log("🐳 Starting Docker Migration...\n");

  try {
    // Prüfe ob Docker Container läuft
    const { stdout: containerCheck } = await execAsync(
      "docker ps --filter name=fanini-mysql --format '{{.Names}}'"
    );

    if (!containerCheck.includes("fanini-mysql")) {
      console.log("🚀 Starting MySQL container...");
      await execAsync("docker-compose up -d mysql");
      // Warte bis MySQL bereit ist
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    // Kopiere Migration ins Container
    const migrationPath = path.join(__dirname, "migrations", "001_complete_schema_clean.sql");

    console.log("📋 Copying migration file to container...");
    await execAsync(
      `docker cp "${migrationPath}" fanini-mysql:/tmp/migration.sql`
    );

    // Führe Migration aus
    console.log("🔄 Executing migration...");
    await execAsync(
      `docker exec fanini-mysql mysql -u fanini -ppassword fanini_db < /tmp/migration.sql`
    );

    console.log("✅ Migration completed successfully!");

  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  dockerMigrate();
}

export default dockerMigrate;
