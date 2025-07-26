// seed/seedComplete.ts
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { DEFAULT_SEED_CONFIG, SeederFunction } from './types';

dotenv.config();

const seeders: readonly string[] = [
  '00-cleanup',
  '01-seedRoles',
  '02-seedUsers',
  '03-seedMembers',
  '04-seedEvents',
  '05-seedTasks',
  '06-seedEventParticipations',
  '07-seedComments',
  '08-seedCreators',
  '09-seedDocuments',
  '10-seedNotifications',
  '11-seedExpenses',
  '12-seedSocialMediaPosts',
  '13-seedProtocols',
  '14-seedEmailTemplates',
  '15-seedFAQ',
  '16-seedMemberRoles',
  '17-seedPermissions'
] as const;

const runSeeders = async (): Promise<void> => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'faninitiative_spandau',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log('🌱 Starting database seeding...\n');
  console.log(`📊 Configuration: ${DEFAULT_SEED_CONFIG.minEvents} events, ${DEFAULT_SEED_CONFIG.publicEventRatio * 100}% public\n`);

  try {
    for (const seederName of seeders) {
      console.log(`📦 Running ${seederName}...`);
      const start = Date.now();

      const seeder: SeederFunction = (await import(`./seeders/${seederName}`)).default;
      const connection = await pool.getConnection();

      try {
        await seeder(connection);
      } finally {
        connection.release();
      }

      const duration = Date.now() - start;
      console.log(`✅ ${seederName} completed in ${duration}ms\n`);
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run if called directly
if (require.main === module) {
  runSeeders();
}

export default runSeeders;
