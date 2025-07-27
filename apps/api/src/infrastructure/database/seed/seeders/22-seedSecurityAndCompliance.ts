// seed/seeders/22-seedSecurityAndCompliance.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, PREDEFINED_IDS } from '../helpers/index.js';

const seedSecurityAndCompliance = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Sensitive Fields
    const sensitiveFields = [
      { entity_type: 'mitglieder', field_name: 'iban', sensitivity_level: 'critical', required_permission: 'member.view_financial' },
      { entity_type: 'mitglieder', field_name: 'geburtsdatum', sensitivity_level: 'high', required_permission: 'member.view_personal' },
      { entity_type: 'mitglieder', field_name: 'adresse_strasse', sensitivity_level: 'high', required_permission: 'member.view_address' },
      { entity_type: 'mitglieder', field_name: 'telefon', sensitivity_level: 'medium', required_permission: 'member.view_contact' },
      { entity_type: 'mitglieder', field_name: 'notfallkontakt_name', sensitivity_level: 'high', required_permission: 'member.view_emergency' },
      { entity_type: 'events', field_name: 'budget', sensitivity_level: 'medium', required_permission: 'event.view_financial' },
      { entity_type: 'ausgaben', field_name: 'betrag', sensitivity_level: 'medium', required_permission: 'expense.view' }
    ];

    for (const field of sensitiveFields) {
      await connection.execute(
        `INSERT INTO sensitive_fields
         (id, entity_type, field_name, sensitivity_level, required_permission, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [generateId('sf'), field.entity_type, field.field_name,
         field.sensitivity_level, field.required_permission,
         `${field.field_name} ist ${field.sensitivity_level} sensitiv`]
      );
    }

    // Permission Groups
    const groups = [
      { id: generateId('pg'), name: 'Basis Mitglieder', description: 'Grundlegende Mitgliederrechte' },
      { id: generateId('pg'), name: 'Event Management', description: 'Event-bezogene Berechtigungen' },
      { id: generateId('pg'), name: 'Finanzen', description: 'Finanzbezogene Berechtigungen' },
      { id: generateId('pg'), name: 'Administration', description: 'Administrative Berechtigungen' }
    ];

    for (const group of groups) {
      await connection.execute(
        `INSERT INTO permission_groups (id, name, description)
         VALUES (?, ?, ?)`,
        [group.id, group.name, group.description]
      );
    }

    // Role Hierarchy
    const hierarchies = [
      { parent: PREDEFINED_IDS.roleAdmin, child: PREDEFINED_IDS.roleVorstand },
      { parent: PREDEFINED_IDS.roleVorstand, child: PREDEFINED_IDS.roleBeirat },
      { parent: PREDEFINED_IDS.roleBeirat, child: PREDEFINED_IDS.roleTeamEvent },
      { parent: PREDEFINED_IDS.roleBeirat, child: PREDEFINED_IDS.roleTeamMedien },
      { parent: PREDEFINED_IDS.roleBeirat, child: PREDEFINED_IDS.roleTeamTechnik },
      { parent: PREDEFINED_IDS.roleBeirat, child: PREDEFINED_IDS.roleTeamVerein }
    ];

    for (const h of hierarchies) {
      await connection.execute(
        `INSERT INTO role_hierarchy (parent_role_id, child_role_id)
         VALUES (?, ?)`,
        [h.parent, h.child]
      );
    }

    await connection.commit();
    console.log('✅ Security and compliance seeded successfully');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Security seeding failed:', error);
    throw error;
  }
};

export default seedSecurityAndCompliance;
