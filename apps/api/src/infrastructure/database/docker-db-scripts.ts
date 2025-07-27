// apps/api/src/infrastructure/database/docker-db-scripts.ts
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTAINER_NAME = "fanini-mysql-1";
const DB_USER = "fanini";
const DB_PASSWORD = "password";
const DB_NAME = "fanini_db";

async function waitForMySQL() {
  console.log("⏳ Waiting for MySQL to be ready...");

  for (let i = 0; i < 30; i++) {
    try {
      const { stdout } = await execAsync(
        `docker exec ${CONTAINER_NAME} mysql -u ${DB_USER} -p${DB_PASSWORD} -e "SELECT 1"`,
      );
      if (stdout.includes("1")) {
        console.log("✅ MySQL is ready!");
        return;
      }
    } catch (error) {
      // MySQL not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error("MySQL failed to start within 30 seconds");
}

async function resetDatabase() {
  console.log("🐳 Resetting Database in Docker...");

  await waitForMySQL();

  // Drop and recreate database
  console.log("🗑️  Dropping database...");
  try {
    await execAsync(
      `docker exec ${CONTAINER_NAME} mysql -u ${DB_USER} -p${DB_PASSWORD} -e "DROP DATABASE IF EXISTS ${DB_NAME}"`,
    );
  } catch (error) {
    console.error("Warning: Could not drop database:", error);
  }

  console.log("✨ Creating database...");
  await execAsync(
    `docker exec ${CONTAINER_NAME} mysql -u ${DB_USER} -p${DB_PASSWORD} -e "CREATE DATABASE ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"`,
  );

  // Kopiere die Migration-Datei in den Container und führe sie aus
  await runMigrationViaFile();
}

async function runMigrationViaFile() {
  console.log("🐳 Running Migration via file...");

  const migrationPath = path.join(
    __dirname,
    "migrations",
    "001_complete_schema.sql",
  );
  const containerPath = "/tmp/migration.sql";

  try {
    // Kopiere Datei in Container
    console.log("📋 Copying migration file to container...");
    await execAsync(
      `docker cp "${migrationPath}" ${CONTAINER_NAME}:${containerPath}`,
    );

    // Führe Migration aus
    console.log("🔄 Executing migration...");

    // Nutze sh -c für Windows-Kompatibilität
    const command = `docker exec ${CONTAINER_NAME} sh -c "mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < ${containerPath}"`;

    try {
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024,
      });

      if (stdout) console.log(stdout);
      if (stderr && !stderr.includes("Warning")) {
        console.error("Migration warnings:", stderr);
      }

      console.log("✅ Migration completed successfully!");
    } catch (error: any) {
      // Prüfe ob es nur Warnungen sind
      if (error.stderr && error.stderr.includes("already exists")) {
        console.log("⚠️  Some tables already exist, but migration completed");
      } else {
        throw error;
      }
    }

    // Cleanup
    await execAsync(`docker exec ${CONTAINER_NAME} rm ${containerPath}`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

async function runSeed() {
  console.log("🌱 Seeding database...");

  await waitForMySQL();

  try {
    // Führe das Seed-Script lokal aus (nicht im Container)
    console.log("📦 Running seed script locally...");

    const seedCommand =
      process.platform === "win32" ? "pnpm db:seed" : "npm run db:seed";

    const { stdout, stderr } = await execAsync(seedCommand, {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024,
      env: {
        ...process.env,
        DB_HOST: "localhost", // Docker exposed port
        DB_PORT: "3306",
        DB_USER: "fanini",
        DB_PASSWORD: "password",
        DB_NAME: "fanini_db",
      },
    });

    if (stdout) console.log(stdout);
    if (stderr && !stderr.includes("Warning")) console.error(stderr);

    console.log("✅ Seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Alternative: Einfachere direkte Methode
async function runMigrationDirect() {
  console.log("🐳 Running Migration directly...");

  await waitForMySQL();

  try {
    // Lese SQL-Datei
    const fs = await import("fs/promises");
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "001_complete_schema.sql",
    );
    const sqlContent = await fs.readFile(migrationPath, "utf-8");

    // Entferne die CREATE DATABASE und USE Statements
    const cleanedSql = sqlContent
      .split("\n")
      .filter((line) => {
        const upper = line.trim().toUpperCase();
        return (
          !upper.startsWith("CREATE DATABASE") &&
          !upper.startsWith("USE ") &&
          !upper.startsWith("--")
        );
      })
      .join("\n");

    // Schreibe bereinigte SQL in temporäre Datei
    const tempPath = path.join(__dirname, "temp_migration.sql");
    await fs.writeFile(tempPath, cleanedSql);

    // Kopiere und führe aus
    await execAsync(
      `docker cp "${tempPath}" ${CONTAINER_NAME}:/tmp/clean_migration.sql`,
    );

    const { stdout, stderr } = await execAsync(
      `docker exec ${CONTAINER_NAME} sh -c "mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < /tmp/clean_migration.sql"`,
      { maxBuffer: 10 * 1024 * 1024 },
    );

    if (stdout) console.log(stdout);

    // Cleanup
    await fs.unlink(tempPath);
    await execAsync(
      `docker exec ${CONTAINER_NAME} rm /tmp/clean_migration.sql`,
    );

    console.log("✅ Migration completed!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Main execution
const command = process.argv[2];

switch (command) {
  case "reset":
    resetDatabase()
      .then(() => runSeed())
      .then(() => {
        console.log("✅ Database reset and seed completed!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Database reset failed:", error);
        process.exit(1);
      });
    break;

  case "migrate":
    runMigrationDirect()
      .then(() => {
        console.log("✅ Migration completed!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Migration failed:", error);
        process.exit(1);
      });
    break;

  case "seed":
    runSeed()
      .then(() => {
        console.log("✅ Seed completed!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
      });
    break;

  default:
    console.log("Usage: tsx docker-db-scripts.ts [reset|migrate|seed]");
    process.exit(1);
}
