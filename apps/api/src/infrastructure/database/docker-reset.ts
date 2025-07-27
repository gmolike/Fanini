// apps/api/src/infrastructure/database/docker-reset.ts
import { exec } from "child_process";
import { promisify } from "util";
import dockerMigrate from "./docker-migrate.js";
import dockerSeed from "./docker-seed.js";

const execAsync = promisify(exec);

async function dockerReset() {
  console.log("🐳 Starting Complete Docker Database Reset...\n");

  try {
    // 1. Stelle sicher dass Container läuft
    console.log("🚀 Ensuring MySQL container is running...");
    await execAsync("docker-compose up -d mysql");

    // Warte bis MySQL bereit ist
    console.log("⏳ Waiting for MySQL to be ready...");
    let attempts = 0;
    while (attempts < 30) {
      try {
        await execAsync(
          `docker exec fanini-mysql mysql -u fanini -ppassword -e "SELECT 1"`
        );
        break;
      } catch {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (attempts === 30) {
      throw new Error("MySQL container failed to start");
    }

    // 2. Lösche und erstelle Datenbank neu
    console.log("🗑️  Dropping existing database...");
    await execAsync(
      `docker exec fanini-mysql mysql -u fanini -ppassword -e "DROP DATABASE IF EXISTS fanini_db"`
    );

    console.log("✨ Creating fresh database...");
    await execAsync(
      `docker exec fanini-mysql mysql -u fanini -ppassword -e "CREATE DATABASE fanini_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"`
    );

    // 3. Führe Migration aus
    console.log("\n📋 Running migration...");
    await dockerMigrate();

    // 4. Führe Seeds aus
    console.log("\n🌱 Running seeds...");
    await dockerSeed();

    console.log("\n🎉 Database reset completed successfully!");

  } catch (error: any) {
    console.error("\n❌ Reset failed:", error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  dockerReset();
}

export default dockerReset;
