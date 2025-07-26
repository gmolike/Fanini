// seed/seeders/16-seedMemberRoles.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { PREDEFINED_IDS } from '../helpers';

const roleAssignments = [
  { mitglied_id: 'mbr_admin', rolle_id: PREDEFINED_IDS.roleAdmin },
  { mitglied_id: 'mbr_vorstand1', rolle_id: PREDEFINED_IDS.roleVorstand },
  { mitglied_id: 'mbr_vorstand2', rolle_id: PREDEFINED_IDS.roleVorstand },
  { mitglied_id: 'mbr_beirat1', rolle_id: PREDEFINED_IDS.roleBeirat },
  { mitglied_id: 'mbr_beirat2', rolle_id: PREDEFINED_IDS.roleBeirat },
  { mitglied_id: 'mbr_event1', rolle_id: PREDEFINED_IDS.roleTeamEvent },
  { mitglied_id: 'mbr_event2', rolle_id: PREDEFINED_IDS.roleTeamEvent },
  { mitglied_id: 'mbr_medien', rolle_id: PREDEFINED_IDS.roleTeamMedien },
  { mitglied_id: 'mbr_technik', rolle_id: PREDEFINED_IDS.roleTeamTechnik },
  { mitglied_id: 'mbr_verein', rolle_id: PREDEFINED_IDS.roleTeamVerein }
];

export const seedMemberRoles = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Assign predefined roles
    for (const assignment of roleAssignments) {
      await connection.execute(
        `INSERT INTO mitglied_rolle (
          mitglied_id, rolle_id, zugewiesen_am, zugewiesen_von
        ) VALUES (?, ?, NOW(), ?)`,
        [
          assignment.mitglied_id,
          assignment.rolle_id,
          PREDEFINED_IDS.admin
        ]
      );
    }

    // Assign MITGLIED role to all members
    const [members] = await connection.execute(
      `SELECT m.id FROM mitglieder m
       WHERE NOT EXISTS (
         SELECT 1 FROM mitglied_rolle mr
         WHERE mr.mitglied_id = m.id
       )`
    );

    for (const member of members as any[]) {
      await connection.execute(
        `INSERT INTO mitglied_rolle (
          mitglied_id, rolle_id, zugewiesen_am, zugewiesen_von
        ) VALUES (?, ?, NOW(), ?)`,
        [
          member.id,
          PREDEFINED_IDS.roleMitglied,
          PREDEFINED_IDS.admin
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${roleAssignments.length + (members as any[]).length} Role assignments seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Member roles seeding failed:', error);
    throw error;
  }
};

export default seedMemberRoles;
