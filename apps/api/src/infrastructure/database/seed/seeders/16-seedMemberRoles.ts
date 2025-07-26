// seed/seeders/16-seedMemberRoles.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { PREDEFINED_IDS } from '../helpers/index.js';

const roleAssignments = [
  { user_id: PREDEFINED_IDS.admin, role_id: PREDEFINED_IDS.roleAdmin },
  { user_id: PREDEFINED_IDS.vorstand1, role_id: PREDEFINED_IDS.roleVorstand },
  { user_id: PREDEFINED_IDS.vorstand2, role_id: PREDEFINED_IDS.roleVorstand },
  { user_id: PREDEFINED_IDS.beirat1, role_id: PREDEFINED_IDS.roleBeirat },
  { user_id: PREDEFINED_IDS.beirat2, role_id: PREDEFINED_IDS.roleBeirat },
  { user_id: PREDEFINED_IDS.teamEvent1, role_id: PREDEFINED_IDS.roleTeamEvent },
  { user_id: PREDEFINED_IDS.teamEvent2, role_id: PREDEFINED_IDS.roleTeamEvent },
  { user_id: PREDEFINED_IDS.teamMedien1, role_id: PREDEFINED_IDS.roleTeamMedien },
  { user_id: PREDEFINED_IDS.teamTechnik1, role_id: PREDEFINED_IDS.roleTeamTechnik },
  { user_id: PREDEFINED_IDS.teamVerein1, role_id: PREDEFINED_IDS.roleTeamVerein }
];

const seedMemberRoles = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Assign predefined roles
    for (const assignment of roleAssignments) {
      await connection.execute(
        `INSERT INTO user_roles (
          user_id, role_id, zugewiesen_am, zugewiesen_von
        ) VALUES (?, ?, NOW(), ?)`,
        [
          assignment.user_id,
          assignment.role_id,
          PREDEFINED_IDS.admin
        ]
      );
    }

    // Assign MITGLIED role to all users without roles
    const [users] = await connection.execute(
      `SELECT u.id FROM users u
       WHERE NOT EXISTS (
         SELECT 1 FROM user_roles ur
         WHERE ur.user_id = u.id
       )`
    );

    for (const user of users as any[]) {
      await connection.execute(
        `INSERT INTO user_roles (
          user_id, role_id, zugewiesen_am, zugewiesen_von
        ) VALUES (?, ?, NOW(), ?)`,
        [
          user.id,
          PREDEFINED_IDS.roleMitglied,
          PREDEFINED_IDS.admin
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${roleAssignments.length + (users as any[]).length} Role assignments seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Member roles seeding failed:', error);
    throw error;
  }
};

export default seedMemberRoles;
