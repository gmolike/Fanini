// apps/api/src/infrastructure/database/docker-seed.ts
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function dockerSeed() {
  console.log("🐳 Starting Docker Seed Process...\n");

  try {
    // Prüfe Container
    const { stdout: containerCheck } = await execAsync(
      "docker ps --filter name=fanini-mysql --format '{{.Names}}'"
    );

    if (!containerCheck.includes("fanini-mysql")) {
      throw new Error("MySQL container is not running! Start it with: docker-compose up -d mysql");
    }

    // Baue API Container (falls noch nicht vorhanden)
    console.log("🔨 Building API container...");
    await execAsync("docker-compose build api");

    // Führe Seed im API Container aus
    console.log("🌱 Running seeds in Docker container...");
    await execAsync(
      `docker-compose run --rm api npm run seed:internal`
    );

    console.log("✅ Seeding completed successfully!");

  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  dockerSeed();
}

export default dockerSeed;
