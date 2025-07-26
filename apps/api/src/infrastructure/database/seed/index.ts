// apps/api/src/infrastructure/database/seed/index.ts
import { Pool } from "mysql2/promise";
import { seedRoles } from "./seeders/01-seedRoles";
import { seedUsers } from "./seeders/02-seedUsers";
import { seedMembers } from "./seeders/03-seedMembers";
import { seedEvents } from "./seeders/04-seedEvents";
import { seedTasks } from "./seeders/05-seedTasks";

export async function seedDatabase(pool: Pool): Promise<void> {
  console.log("🌱 Starte Database Seeding...\n");

  try {
    // Cleanup
    console.log("🧹 Lösche alte Daten...");
    await cleanDatabase(pool);

    // Seed in korrekter Reihenfolge
    await seedRoles(pool);
    const userData = await seedUsers(pool);
    const memberData = await seedMembers(pool, userData);
    const eventIds = await seedEvents(pool, memberData);
    await seedTasks(pool, eventIds, memberData);

    // Weitere Seeder...

    console.log("\n✅ Seeding erfolgreich abgeschlossen!");
    console.log("\n🔑 Test-Logins:");
    console.log("Admin: admin@fanini-spandau.de / Admin2025!");
    console.log("Vorstand: vorstand1@fanini-spandau.de / Vorstand2025!");
    console.log("Team Event: event@fanini-spandau.de / Team2025!");
    console.log("Mitglied: anna.meyer@example.com / Mitglied2025!");
  } catch (error) {
    console.error("\n❌ Fehler beim Seeding:", error);
    throw error;
  }
}

export async function cleanDatabase(pool: Pool): Promise<void> {
  console.log("\n🧹 Cleaning database...");

  const tablesToClean = [
    // Audit & Logging (keine Abhängigkeiten)
    "field_access_log",
    "upload_logs",

    // Auth & Security
    "password_history",
    "refresh_tokens",

    // Approval System
    "approval_notifications",
    "approval_actions",
    "approval_requests",
    "approval_rules",

    // Communication
    "newsletter_subscriptions",
    "newsletters",
    "faqs",

    // Finance
    "ausgaben",

    // Legacy
    "aufgaben",

    // Creators
    "creator_works",
    "creator_types",
    "creators",
    "creators_extended",

    // Documents
    "document_tags",
    "documents",

    // Tasks
    "task_audit_log",
    "task_comments",
    "task_assignments",
    "tasks",

    // Events
    "event_audit_log",
    "event_teilnahme",
    "event_teilnahmen",
    "events",

    // Organization
    "gremium_members",
    "gremien",

    // Members & Users
    "member_visibility_overrides",
    "sensitive_fields",
    "role_permissions",
    "permissions",
    "permission_groups",
    "role_hierarchy",
    "user_roles",
    "mitglieder",
    "users",
    "roles",

    // Global Settings (keine Abhängigkeiten)
    "settings",
  ];

  try {
    // Foreign Key Checks deaktivieren für Cleanup
    await pool.execute("SET FOREIGN_KEY_CHECKS = 0");

    for (const table of tablesToClean) {
      try {
        await pool.execute(`TRUNCATE TABLE ${table}`);
        console.log(`  ✓ ${table}`);
      } catch (error: any) {
        if (error.code === "ER_NO_SUCH_TABLE") {
          // Tabelle existiert nicht - das ist OK
          console.log(`  - ${table} (nicht vorhanden)`);
        } else {
          console.warn(`  ⚠ ${table}: ${error.message}`);
        }
      }
    }

    // Foreign Key Checks wieder aktivieren
    await pool.execute("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✅ Database cleaned successfully\n");
  } catch (error) {
    // Bei Fehler sicherstellen, dass Foreign Key Checks wieder aktiviert werden
    await pool.execute("SET FOREIGN_KEY_CHECKS = 1");
    throw error;
  }
}
