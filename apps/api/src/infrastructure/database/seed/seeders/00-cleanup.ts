// seed/seeders/00-cleanup.ts
import { Connection, PoolConnection } from 'mysql2/promise';

const tables = [
  // Richtige Tabellennamen aus der Migration
  'user_roles',
  'event_teilnahmen',
  'event_teilnahme',
  'task_comments',
  'task_assignments',
  'task_audit_log',
  'tasks',
  'ausgaben',
  'newsletter_subscriptions',
  'newsletters',
  'creator_works',
  'creator_types',
  'creators_extended',
  'creators',
  'tagesordnungspunkte',
  'protokolle',
  'email_vorlagen',
  'documents',
  'document_tags',
  'events',
  'event_audit_log',
  'mitglieder',
  'refresh_tokens',
  'password_history',
  'role_permissions',
  'permissions',
  'permission_groups',
  'user_roles',
  'users',
  'role_hierarchy',
  'roles',
  'faqs',
  'gremien',
  'gremium_members',
  'settings',
  'approval_requests',
  'approval_actions',
  'approval_rules',
  'approval_notifications',
  'sensitive_fields',
  'member_visibility_overrides',
  'field_access_log',
  'upload_logs',
  'aufgaben'
] as const;

const cleanup = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Disable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Truncate all tables
    for (const table of tables) {
      try {
        await connection.execute(`TRUNCATE TABLE ${table}`);
        console.log(`  ✓ Cleaned table: ${table}`);
      } catch (error: any) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
          console.log(`  ⚠️  Table ${table} doesn't exist, skipping...`);
        } else {
          console.error(`  ❌ Error cleaning ${table}:`, error.message);
        }
      }
    }

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    await connection.commit();
    console.log('✅ Database cleanup completed');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Cleanup failed:', error);
    throw error;
  }
};

export default cleanup;
