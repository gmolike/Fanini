// apps/api/src/infrastructure/database/docker-db-scripts.ts
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

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

  // Run ALL migrations
  await runAllMigrations();
}

async function runAllMigrations() {
  console.log("🐳 Running all migrations...");

  const migrationsDir = path.join(__dirname, "migrations");

  try {
    // Get all SQL files in migrations directory
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files
      .filter(file => file.endsWith(".sql"))
      .sort(); // Sort to ensure correct order (001_, 002_, etc.)

    console.log(`📁 Found ${sqlFiles.length} migration files`);

    for (const file of sqlFiles) {
      console.log(`\n🔄 Running migration: ${file}`);

      const migrationPath = path.join(migrationsDir, file);
      const containerPath = `/tmp/${file}`;

      try {
        // Copy file to container
        await execAsync(
          `docker cp "${migrationPath}" ${CONTAINER_NAME}:${containerPath}`,
        );

        // Execute migration
        const command = `docker exec ${CONTAINER_NAME} sh -c "mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < ${containerPath}"`;

        const { stdout, stderr } = await execAsync(command, {
          maxBuffer: 10 * 1024 * 1024,
        });

        if (stdout) console.log(stdout);
        if (stderr && !stderr.includes("Warning")) {
          console.error("Migration warnings:", stderr);
        }

        console.log(`✅ ${file} completed successfully!`);

        // Cleanup
        await execAsync(`docker exec ${CONTAINER_NAME} rm ${containerPath}`);
      } catch (error: any) {
        // Check if it's just warnings
        if (error.stderr && error.stderr.includes("already exists")) {
          console.log(`⚠️  Some tables already exist in ${file}, but migration completed`);
        } else {
          console.error(`❌ ${file} failed:`, error);
          throw error;
        }
      }
    }

    console.log("\n✅ All migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

async function runMigrationViaFile() {
  // This function is now replaced by runAllMigrations
  await runAllMigrations();
}

async function runSeed() {
  console.log("🌱 Seeding database...");

  await waitForMySQL();

  try {
    console.log("📦 Running seed script locally...");

    const seedCommand =
      process.platform === "win32" ? "pnpm db:seed" : "npm run db:seed";

    const { stdout, stderr } = await execAsync(seedCommand, {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024,
      env: {
        ...process.env,
        DB_HOST: "localhost",
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
    runAllMigrations()
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
