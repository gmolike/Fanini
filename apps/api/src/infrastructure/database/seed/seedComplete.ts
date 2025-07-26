// apps/api/src/infrastructure/database/seed/seedComplete.ts
import { pathToFileURL } from "url";
import { pool } from "../connection";

// Import all seeders in correct order
import { cleanDatabase } from "./seeders/00-cleanup";
import { seedBaseData } from "./seeders/01-baseData";
import { seedUsersAndMembers } from "./seeders/02-usersAndMembers";
import { seedOrganization } from "./seeders/03-organization";
import { seedEvents } from "./seeders/04-events";
import { seedTasks } from "./seeders/05-tasks";
import { seedDocuments } from "./seeders/06-documents";
import { seedCreators } from "./seeders/07-creators";
import { seedCommunication } from "./seeders/08-communication";
import { seedFinance } from "./seeders/09-finance";
import { seedAuditAndSecurity } from "./seeders/10-auditAndSecurity";

export async function seedCompleteDatabase() {
  console.log("🔥 COMPLETE SEED SCRIPT STARTING!");

  try {
    // Test connection
    const testConnection = await pool.getConnection();
    console.log("✅ Database connection successful!");
    testConnection.release();

    // Clean all data
    await cleanDatabase(pool);

    // Seed in correct order
    const baseData = await seedBaseData(pool);
    const userData = await seedUsersAndMembers(pool, baseData);
    const orgData = await seedOrganization(pool, userData);
    const eventData = await seedEvents(pool, userData);
    const taskData = await seedTasks(pool, userData, eventData);
    await seedDocuments(pool, userData);
    await seedCreators(pool, userData);
    await seedCommunication(pool, userData);
    await seedFinance(pool, userData, eventData);
    await seedAuditAndSecurity(pool, userData);

    console.log("\n✅ Complete seeding finished successfully!");
    printSummary();
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

function printSummary() {
  console.log("\n📊 Summary:");
  console.log("- Base data (roles, permissions, settings) ✓");
  console.log("- Users and members ✓");
  console.log("- Organization structure ✓");
  console.log("- Events and participations ✓");
  console.log("- Tasks and assignments ✓");
  console.log("- Documents ✓");
  console.log("- Creators and works ✓");
  console.log("- Communication (FAQ, Newsletter) ✓");
  console.log("- Finance data ✓");
  console.log("- Audit logs ✓");

  console.log("\n🔑 Test Logins:");
  console.log("Admin: admin@fanini-spandau.de / Admin2025!");
  console.log("Vorstand: vorstand1@fanini-spandau.de / Vorstand2025!");
  console.log("Team Event: event@fanini-spandau.de / Team2025!");
  console.log("Mitglied: anna.meyer@example.com / Mitglied2025!");
}

// Run if called directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedCompleteDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
