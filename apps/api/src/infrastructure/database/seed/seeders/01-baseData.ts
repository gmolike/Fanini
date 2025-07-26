// apps/api/src/infrastructure/database/seed/seeders/01-baseData.ts
import { Pool } from "mysql2/promise";
import { generateId } from "../helpers/generators";

export async function seedBaseData(pool: Pool) {
  console.log("🎯 Seeding base data...");

  // Settings
  await pool.execute(`
    INSERT INTO settings (
      id, association_name, founded_year, passion_percentage,
      contact_email, primary_color, secondary_color
    ) VALUES (
      'global-settings', 'Faninitiative Spandau e.V.', 2025, 100,
      'info@fanini-spandau.de', '#34687e', '#b94f46'
    )
  `);
  console.log("  ✓ Settings");

  // Roles
  const roles = [
    { id: 'role_admin', name: 'ADMIN', beschreibung: 'Systemadministrator', hierarchie_ebene: 1 },
    { id: 'role_vorstand', name: 'VORSTAND', beschreibung: 'Vorstandsmitglied', hierarchie_ebene: 2 },
    { id: 'role_beirat', name: 'BEIRAT', beschreibung: 'Beiratsmitglied', hierarchie_ebene: 3 },
    { id: 'role_kassenprufer', name: 'KASSENPRUFER', beschreibung: 'Kassenprüfer', hierarchie_ebene: 3 },
    { id: 'role_team_event', name: 'TEAM_EVENT', beschreibung: 'Team Event', hierarchie_ebene: 4 },
    { id: 'role_team_medien', name: 'TEAM_MEDIEN', beschreibung: 'Team Medien', hierarchie_ebene: 4 },
    { id: 'role_team_technik', name: 'TEAM_TECHNIK', beschreibung: 'Team Technik', hierarchie_ebene: 4 },
    { id: 'role_team_verein', name: 'TEAM_VEREIN', beschreibung: 'Team Verein', hierarchie_ebene: 4 },
    { id: 'role_mitglied', name: 'MITGLIED', beschreibung: 'Vereinsmitglied', hierarchie_ebene: 5 }
  ];

  for (const role of roles) {
    await pool.execute(
      `INSERT INTO roles (id, name, beschreibung, hierarchie_ebene) VALUES (?, ?, ?, ?)`,
      [role.id, role.name, role.beschreibung, role.hierarchie_ebene]
    );
  }
  console.log(`  ✓ ${roles.length} Roles`);

  // Permission Groups
  const permissionGroups = [
    { id: generateId(), name: 'Mitgliederverwaltung', description: 'Berechtigungen für Mitgliederverwaltung' },
    { id: generateId(), name: 'Eventmanagement', description: 'Berechtigungen für Event-Verwaltung' },
    { id: generateId(), name: 'Finanzen', description: 'Berechtigungen für Finanzverwaltung' },
    { id: generateId(), name: 'Content', description: 'Berechtigungen für Content-Verwaltung' }
  ];

  const groupIds: Record<string, string> = {};
  for (const group of permissionGroups) {
    groupIds[group.name] = group.id;
    await pool.execute(
      `INSERT INTO permission_groups (id, name, description) VALUES (?, ?, ?)`,
      [group.id, group.name, group.description]
    );
  }
  console.log(`  ✓ ${permissionGroups.length} Permission Groups`);

  // Permissions
  const permissions = [
    // Mitglieder
    { resource: 'member', action: 'view', group: 'Mitgliederverwaltung' },
    { resource: 'member', action: 'create', group: 'Mitgliederverwaltung' },
    { resource: 'member', action: 'edit', group: 'Mitgliederverwaltung' },
    { resource: 'member', action: 'delete', group: 'Mitgliederverwaltung' },
    { resource: 'member', action: 'export', group: 'Mitgliederverwaltung' },

    // Events
    { resource: 'event', action: 'view', group: 'Eventmanagement' },
    { resource: 'event', action: 'create', group: 'Eventmanagement' },
    { resource: 'event', action: 'edit', group: 'Eventmanagement' },
    { resource: 'event', action: 'delete', group: 'Eventmanagement' },
    { resource: 'event', action: 'approve', group: 'Eventmanagement' },

    // Finanzen
    { resource: 'expense', action: 'view', group: 'Finanzen' },
    { resource: 'expense', action: 'create', group: 'Finanzen' },
    { resource: 'expense', action: 'approve', group: 'Finanzen' },

    // Content
    { resource: 'document', action: 'view', group: 'Content' },
    { resource: 'document', action: 'create', group: 'Content' },
    { resource: 'document', action: 'edit', group: 'Content' },
    { resource: 'document', action: 'delete', group: 'Content' }
  ];

  const permissionIds: Record<string, string> = {};
  for (const perm of permissions) {
    const id = generateId();
    const key = `${perm.resource}:${perm.action}`;
    permissionIds[key] = id;

    await pool.execute(
      `INSERT INTO permissions (id, resource, action, group_id, beschreibung) VALUES (?, ?, ?, ?, ?)`,
      [id, perm.resource, perm.action, groupIds[perm.group], `${perm.action} ${perm.resource}`]
    );
  }
  console.log(`  ✓ ${permissions.length} Permissions`);

  // Role Permissions
  const rolePermissions = [
    // Admin hat alle Rechte
    { role: 'role_admin', permissions: Object.keys(permissionIds) },

    // Vorstand
    { role: 'role_vorstand', permissions: [
      'member:view', 'member:edit', 'member:export',
      'event:view', 'event:create', 'event:edit', 'event:approve',
      'expense:view', 'expense:approve',
      'document:view', 'document:create', 'document:edit'
    ]},

    // Team Event
    { role: 'role_team_event', permissions: [
      'event:view', 'event:create', 'event:edit',
      'expense:view', 'expense:create'
    ]},

    // Mitglied
    { role: 'role_mitglied', permissions: [
      'event:view',
      'document:view'
    ]}
  ];

  for (const rp of rolePermissions) {
    for (const permKey of rp.permissions) {
      if (permissionIds[permKey]) {
        await pool.execute(
          `INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
          [rp.role, permissionIds[permKey]]
        );
      }
    }
  }
  console.log("  ✓ Role Permissions");

  // Sensitive Fields
  const sensitiveFields = [
    { entity: 'mitglieder', field: 'iban', level: 'critical', permission: 'member:export' },
    { entity: 'mitglieder', field: 'geburtsdatum', level: 'high', permission: 'member:view' },
    { entity: 'mitglieder', field: 'telefon', level: 'medium', permission: 'member:view' },
    { entity: 'mitglieder', field: 'adresse_strasse', level: 'high', permission: 'member:view' }
  ];

  for (const sf of sensitiveFields) {
    await pool.execute(
      `INSERT INTO sensitive_fields (id, entity_type, field_name, sensitivity_level, required_permission)
       VALUES (?, ?, ?, ?, ?)`,
      [generateId(), sf.entity, sf.field, sf.level, sf.permission]
    );
  }
  console.log(`  ✓ ${sensitiveFields.length} Sensitive Fields`);

  // Approval Rules
  const approvalRules = [
    { resource: 'event', action: 'create', role: 'role_beirat', approvers: 1 },
    { resource: 'event', action: 'budget_over_1000', role: 'role_vorstand', approvers: 2 },
    { resource: 'expense', action: 'approve', role: 'role_vorstand', approvers: 1 },
    { resource: 'member', action: 'role_change', role: 'role_vorstand', approvers: 2 }
  ];

  for (const rule of approvalRules) {
    await pool.execute(
      `INSERT INTO approval_rules (id, resource_type, action, required_role_id, min_approvers)
       VALUES (?, ?, ?, ?, ?)`,
      [generateId(), rule.resource, rule.action, rule.role, rule.approvers]
    );
  }
  console.log(`  ✓ ${approvalRules.length} Approval Rules`);

  return { roles, permissionGroups: groupIds, permissions: permissionIds };
}
