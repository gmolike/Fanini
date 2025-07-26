// apps/api/src/infrastructure/database/seed/seeders/00-cleanup.ts
import { Pool } from "mysql2/promise";

export async function cleanDatabase(pool: Pool): Promise<void> {
  console.log("\n🧹 Cleaning database...");

  const tablesToClean = [
    // Audit & Security (no dependencies)
    'field_access_log',
    'upload_logs',
    'password_history',
    'refresh_tokens',

    // Approvals
    'approval_notifications',
    'approval_actions',
    'approval_requests',

    // Communication
    'newsletter_sections',
    'newsletter_subscriptions',
    'newsletters',
    'faqs',

    // Finance
    'ausgaben',

    // Creators
    'creator_works',
    'creator_types',
    'creators_extended',
    'creators',

    // Documents
    'document_tags',
    'documents',

    // Tasks
    'task_audit_log',
    'task_comments',
    'task_assignments',
    'tasks',

    // Events
    'event_audit_log',
    'event_teilnahme',
    'event_teilnahmen',
    'events',

    // Organization
    'gremium_members',
    'gremien',

    // Members & Users
    'member_visibility_overrides',
    'role_permissions',
    'user_roles',
    'mitglieder',
    'users',

    // Base tables
    'approval_rules',
    'sensitive_fields',
    'permissions',
    'permission_groups',
    'role_hierarchy',
    'roles',
    'settings'
  ];

  await pool.execute('SET FOREIGN_KEY_CHECKS = 0');

  for (const table of tablesToClean) {
    try {
      await pool.execute(`TRUNCATE TABLE ${table}`);
      console.log(`  ✓ ${table}`);
    } catch (error: any) {
      if (error.code !== 'ER_NO_SUCH_TABLE') {
        console.warn(`  ⚠ ${table}: ${error.message}`);
      }
    }
  }

  await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
  console.log("✅ Database cleaned\n");
}
