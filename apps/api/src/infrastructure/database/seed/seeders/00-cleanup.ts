// seed/seeders/00-cleanup.ts
import { Connection, PoolConnection } from 'mysql2/promise';

const tables = [
  'mitglied_rolle',
  'event_teilnahmen',
  'kommentare',
  'benachrichtigungen',
  'aufgaben',
  'ausgaben',
  'social_media_posts',
  'werke',
  'creators',
  'tagesordnungspunkte',
  'protokolle',
  'email_vorlagen',
  'dokumente',
  'events',
  'mitglieder',
  'users',
  'berechtigungen',
  'rollen'
] as const;

export const cleanup = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Disable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Truncate all tables
    for (const table of tables) {
      try {
        await connection.execute(`TRUNCATE TABLE ${table}`);
        console.log(`  ✓ Cleaned table: ${table}`);
      } catch (error) {
        console.log(`  ⚠️  Table ${table} might not exist, skipping...`);
        console.error(error);
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
