// seed/seeders/02-seedUsers.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { PREDEFINED_IDS, passwords } from '../helpers';

const users = [
  { id: PREDEFINED_IDS.admin, email: 'admin@faninitiative-spandau.de', password_hash: passwords.admin },
  { id: PREDEFINED_IDS.vorstand1, email: 'vorstand1@faninitiative-spandau.de', password_hash: passwords.vorstand },
  { id: PREDEFINED_IDS.vorstand2, email: 'vorstand2@faninitiative-spandau.de', password_hash: passwords.vorstand },
  { id: PREDEFINED_IDS.beirat1, email: 'beirat1@faninitiative-spandau.de', password_hash: passwords.vorstand },
  { id: PREDEFINED_IDS.beirat2, email: 'beirat2@faninitiative-spandau.de', password_hash: passwords.vorstand },
  { id: PREDEFINED_IDS.teamEvent1, email: 'event1@faninitiative-spandau.de', password_hash: passwords.team },
  { id: PREDEFINED_IDS.teamEvent2, email: 'event2@faninitiative-spandau.de', password_hash: passwords.team },
  { id: PREDEFINED_IDS.teamMedien1, email: 'medien@faninitiative-spandau.de', password_hash: passwords.team },
  { id: PREDEFINED_IDS.teamTechnik1, email: 'technik@faninitiative-spandau.de', password_hash: passwords.team },
  { id: PREDEFINED_IDS.teamVerein1, email: 'verein@faninitiative-spandau.de', password_hash: passwords.team }
];

export const seedUsers = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    for (const user of users) {
      await connection.execute(
        'INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, NOW())',
        [user.id, user.email, user.password_hash]
      );
    }

    console.log(`  ✓ Created ${users.length} admin/team users`);
    await connection.commit();
    console.log('✅ Users seeded successfully');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Users seeding failed:', error);
    throw error;
  }
};

export default seedUsers;
