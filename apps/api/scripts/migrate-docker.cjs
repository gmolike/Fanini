// apps/api/scripts/migrate-docker.cjs (mit .cjs Endung!)
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Running database migrations in Docker...\n");

const migrationsDir = path.join(
  __dirname,
  "../src/infrastructure/database/migrations",
);
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

console.log(`📋 Found ${files.length} migration files\n`);

for (const file of files) {
  console.log(`📄 Running migration: ${file}`);

  try {
    const filePath = path.join(migrationsDir, file);
    const command = `docker exec -i fanini-mysql-1 mysql -u root -prootpassword fanini_db < "${filePath}"`;

    execSync(command, {
      stdio: "inherit",
      shell: true,
    });

    console.log(`   ✅ ${file} completed\n`);
  } catch (error) {
    console.error(`   ❌ ${file} failed:`, error.message);
    process.exit(1);
  }
}

console.log("✅ All migrations completed!");
