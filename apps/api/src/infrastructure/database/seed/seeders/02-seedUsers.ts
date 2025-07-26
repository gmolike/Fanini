// seed/seeders/02-seedUsers.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { PREDEFINED_IDS, passwords } from '../helpers/index.js';

const users = [
  {
    id: PREDEFINED_IDS.admin,
    email: 'admin@faninitiative-spandau.de',
    vorname: 'Admin',
    nachname: 'System',
    password_hash: passwords.admin,
    role: 'ADMIN'
  },
  {
    id: PREDEFINED_IDS.vorstand1,
    email: 'vorstand1@faninitiative-spandau.de',
    vorname: 'Thomas',
    nachname: 'Müller',
    password_hash: passwords.vorstand,
    role: 'VORSTAND'
  },
  {
    id: PREDEFINED_IDS.vorstand2,
    email: 'vorstand2@faninitiative-spandau.de',
    vorname: 'Sandra',
    nachname: 'Schmidt',
    password_hash: passwords.vorstand,
    role: 'VORSTAND'
  },
  {
    id: PREDEFINED_IDS.beirat1,
    email: 'beirat1@faninitiative-spandau.de',
    vorname: 'Michael',
    nachname: 'Weber',
    password_hash: passwords.vorstand,
    role: 'BEIRAT'
  },
  {
    id: PREDEFINED_IDS.beirat2,
    email: 'beirat2@faninitiative-spandau.de',
    vorname: 'Julia',
    nachname: 'Fischer',
    password_hash: passwords.vorstand,
    role: 'BEIRAT'
  },
  {
    id: PREDEFINED_IDS.teamEvent1,
    email: 'event1@faninitiative-spandau.de',
    vorname: 'Felix',
    nachname: 'Wagner',
    password_hash: passwords.team,
    role: 'TEAM_EVENT'
  },
  {
    id: PREDEFINED_IDS.teamEvent2,
    email: 'event2@faninitiative-spandau.de',
    vorname: 'Lisa',
    nachname: 'Becker',
    password_hash: passwords.team,
    role: 'TEAM_EVENT'
  },
  {
    id: PREDEFINED_IDS.teamMedien1,
    email: 'medien@faninitiative-spandau.de',
    vorname: 'Tim',
    nachname: 'Meyer',
    password_hash: passwords.team,
    role: 'TEAM_MEDIEN'
  },
  {
    id: PREDEFINED_IDS.teamTechnik1,
    email: 'technik@faninitiative-spandau.de',
    vorname: 'Jan',
    nachname: 'Schulz',
    password_hash: passwords.team,
    role: 'TEAM_TECHNIK'
  },
  {
    id: PREDEFINED_IDS.teamVerein1,
    email: 'verein@faninitiative-spandau.de',
    vorname: 'Anna',
    nachname: 'Hoffmann',
    password_hash: passwords.team,
    role: 'TEAM_VEREIN'
  }
];

const seedUsers = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    for (const user of users) {
      await connection.execute(
        `INSERT INTO users (
          id, email, vorname, nachname, password_hash,
          auth_source, ist_aktiv, role, erstellt_am
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          user.id,
          user.email,
          user.vorname,
          user.nachname,
          user.password_hash,
          'local',  // Diese sind lokale Admin-User
          true,
          user.role
        ]
      );
    }

    console.log(`  ✓ Created ${users.length} admin/team users`);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('❌ Users seeding failed:', error);
    throw error;
  }
};

export default seedUsers;
