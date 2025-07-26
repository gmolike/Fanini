// seed/seeders/17-seedPermissions.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, PREDEFINED_IDS } from '../helpers';

const permissions = [
  // Admin permissions
  { rolle_id: PREDEFINED_IDS.roleAdmin, aktion: '*', ressource: '*', bedingung: null },

  // Vorstand permissions
  { rolle_id: PREDEFINED_IDS.roleVorstand, aktion: 'create', ressource: 'event', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleVorstand, aktion: 'update', ressource: 'event', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleVorstand, aktion: 'delete', ressource: 'event', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleVorstand, aktion: 'approve', ressource: 'expense', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleVorstand, aktion: 'manage', ressource: 'member', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleVorstand, aktion: 'edit', ressource: 'document', bedingung: null },

  // Beirat permissions
  { rolle_id: PREDEFINED_IDS.roleBeirat, aktion: 'approve', ressource: 'event', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleBeirat, aktion: 'approve', ressource: 'expense', bedingung: 'limit:500' },
  { rolle_id: PREDEFINED_IDS.roleBeirat, aktion: 'manage', ressource: 'member', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleBeirat, aktion: 'approve', ressource: 'creator', bedingung: null },

  // Team Event permissions
  { rolle_id: PREDEFINED_IDS.roleTeamEvent, aktion: 'create', ressource: 'event', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleTeamEvent, aktion: 'update', ressource: 'event', bedingung: 'own' },
  { rolle_id: PREDEFINED_IDS.roleTeamEvent, aktion: 'assign', ressource: 'task', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleTeamEvent, aktion: 'manage', ressource: 'participant', bedingung: null },

  // Team Medien permissions
  { rolle_id: PREDEFINED_IDS.roleTeamMedien, aktion: 'create', ressource: 'social_post', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleTeamMedien, aktion: 'manage', ressource: 'creator', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleTeamMedien, aktion: 'upload', ressource: 'media', bedingung: null },

  // Team Technik permissions
  { rolle_id: PREDEFINED_IDS.roleTeamTechnik, aktion: 'monitor', ressource: 'system', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleTeamTechnik, aktion: 'backup', ressource: 'database', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleTeamTechnik, aktion: 'support', ressource: 'user', bedingung: null },

  // Team Verein permissions
  { rolle_id: PREDEFINED_IDS.roleTeamVerein, aktion: 'manage', ressource: 'email_template', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleTeamVerein, aktion: 'create', ressource: 'newsletter', bedingung: null },

  // Mitglied permissions
  { rolle_id: PREDEFINED_IDS.roleMitglied, aktion: 'read', ressource: 'event', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleMitglied, aktion: 'register', ressource: 'event', bedingung: null },
  { rolle_id: PREDEFINED_IDS.roleMitglied, aktion: 'update', ressource: 'profile', bedingung: 'own' },
  { rolle_id: PREDEFINED_IDS.roleMitglied, aktion: 'comment', ressource: 'event', bedingung: null }
];

export const seedPermissions = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    for (const permission of permissions) {
      await connection.execute(
        `INSERT INTO berechtigungen (
          id, rolle_id, aktion, ressource, bedingung
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          generateId('prm'),
          permission.rolle_id,
          permission.aktion,
          permission.ressource,
          permission.bedingung
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${permissions.length} Permissions seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Permissions seeding failed:', error);
    throw error;
  }
};

export default seedPermissions;
