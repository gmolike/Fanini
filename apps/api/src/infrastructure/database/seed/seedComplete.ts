// apps/api/src/infrastructure/database/seed/seedComplete.ts
import { createPool } from "mysql2/promise";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { DEFAULT_SEED_CONFIG, type SeederFunction } from "./types/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const seeders: readonly string[] = [
  "00-cleanup",
  "01-seedRoles",
  "17-seedPermissions",
  "02-seedUsers",
  "03-seedMembers",
  "16-seedMemberRoles",
  "04-seedEvents",
  "05-seedTasks",
  "06-seedEventParticipations",
  "07-seedComments",
  "08-seedCreators",
  "09-seedDocuments",
  "10-seedNotifications",
  "11-seedExpenses",
  "12-seedSocialMediaPosts",
  "13-seedProtocols",
  "14-seedEmailTemplates",
  "15-seedFAQ",
  "18-seedApprovalSystem",
  "19-seedSettings",
  "20-seedGremien",
  "21-seedTaskDetails",
  "22-seedSecurityAndCompliance",
  "23-seedEventAuditLog",
] as const;

const runSeeders = async (): Promise<void> => {
  console.log("🔌 Connecting to database...");

  const pool = createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "fanini",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "fanini_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("🌱 Starting database seeding...\n");
  console.log(
    `📊 Configuration: ${DEFAULT_SEED_CONFIG.minEvents} events, ${DEFAULT_SEED_CONFIG.publicEventRatio * 100}% public\n`,
  );

  try {
    // Test connection
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully\n");
    connection.release();

    for (const seederName of seeders) {
      console.log(`📦 Running ${seederName}...`);
      const start = Date.now();

      try {
        const seederModule = await import(`./seeders/${seederName}.js`);
        const seeder: SeederFunction = seederModule.default;
        const connection = await pool.getConnection();

        try {
          await seeder(connection);
        } finally {
          connection.release();
        }

        const duration = Date.now() - start;
        console.log(`✅ ${seederName} completed in ${duration}ms\n`);
      } catch (error) {
        console.error(`❌ Failed to run ${seederName}:`, error);
        throw error;
      }
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// ESM way to check if file is run directly
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  console.log("🚀 Starting seed process...");
  runSeeders()
    .then(() => {
      console.log("✅ Seed process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seed process failed:", error);
      process.exit(1);
    });
} else {
  console.log("⚠️  seedComplete.ts was imported, not run directly");
}

export { runSeeders as seedCompleteDatabase };
export default runSeeders;
