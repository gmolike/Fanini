// seed/seeders/17-seedPermissions.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { generateId, PREDEFINED_IDS } from "../helpers/index.js";

// Definiere alle einzigartigen Permissions
const uniquePermissions = [
  { resource: "*", action: "*", description: "Full system access" },
  { resource: "event", action: "create", description: "Create events" },
  { resource: "event", action: "update", description: "Update events" },
  { resource: "event", action: "delete", description: "Delete events" },
  { resource: "event", action: "approve", description: "Approve events" },
  { resource: "event", action: "read", description: "View events" },
  { resource: "event", action: "register", description: "Register for events" },
  { resource: "event", action: "comment", description: "Comment on events" },
  { resource: "expense", action: "approve", description: "Approve expenses" },
  {
    resource: "expense",
    action: "create",
    description: "Create expense requests",
  },
  { resource: "member", action: "manage", description: "Manage members" },
  { resource: "member", action: "view", description: "View member list" },
  { resource: "document", action: "edit", description: "Edit documents" },
  { resource: "document", action: "update", description: "Update documents" },
  { resource: "protocol", action: "create", description: "Create protocols" },
  { resource: "roles", action: "manage", description: "Manage roles" },
  { resource: "creator", action: "approve", description: "Approve creators" },
  { resource: "creator", action: "manage", description: "Manage creators" },
  { resource: "finances", action: "view", description: "View financial data" },
  { resource: "task", action: "assign", description: "Assign tasks" },
  { resource: "task", action: "update", description: "Update tasks" },
  {
    resource: "participant",
    action: "manage",
    description: "Manage event participants",
  },
  {
    resource: "budget",
    action: "view",
    description: "View budget information",
  },
  {
    resource: "social_post",
    action: "create",
    description: "Create social media posts",
  },
  { resource: "media", action: "upload", description: "Upload media files" },
  {
    resource: "newsletter",
    action: "create",
    description: "Create newsletters",
  },
  {
    resource: "gallery",
    action: "manage",
    description: "Manage media gallery",
  },
  {
    resource: "system",
    action: "monitor",
    description: "Monitor system status",
  },
  { resource: "database", action: "backup", description: "Backup database" },
  { resource: "user", action: "support", description: "Provide user support" },
  {
    resource: "integrations",
    action: "manage",
    description: "Manage integrations",
  },
  { resource: "logs", action: "view", description: "View system logs" },
  {
    resource: "email_template",
    action: "manage",
    description: "Manage email templates",
  },
  { resource: "faq", action: "manage", description: "Manage FAQ entries" },
  { resource: "profile", action: "update", description: "Update own profile" },
];

// Definiere Role-Permission Mappings
const rolePermissionMappings = [
  // Admin gets everything
  { role_id: PREDEFINED_IDS.roleAdmin, resource: "*", action: "*" },

  // Vorstand permissions
  { role_id: PREDEFINED_IDS.roleVorstand, resource: "event", action: "create" },
  { role_id: PREDEFINED_IDS.roleVorstand, resource: "event", action: "update" },
  { role_id: PREDEFINED_IDS.roleVorstand, resource: "event", action: "delete" },
  {
    role_id: PREDEFINED_IDS.roleVorstand,
    resource: "expense",
    action: "approve",
  },
  {
    role_id: PREDEFINED_IDS.roleVorstand,
    resource: "member",
    action: "manage",
  },
  {
    role_id: PREDEFINED_IDS.roleVorstand,
    resource: "document",
    action: "edit",
  },
  {
    role_id: PREDEFINED_IDS.roleVorstand,
    resource: "protocol",
    action: "create",
  },
  { role_id: PREDEFINED_IDS.roleVorstand, resource: "roles", action: "manage" },

  // Beirat permissions
  { role_id: PREDEFINED_IDS.roleBeirat, resource: "event", action: "approve" },
  {
    role_id: PREDEFINED_IDS.roleBeirat,
    resource: "expense",
    action: "approve",
  },
  { role_id: PREDEFINED_IDS.roleBeirat, resource: "member", action: "manage" },
  {
    role_id: PREDEFINED_IDS.roleBeirat,
    resource: "creator",
    action: "approve",
  },
  {
    role_id: PREDEFINED_IDS.roleBeirat,
    resource: "protocol",
    action: "create",
  },
  { role_id: PREDEFINED_IDS.roleBeirat, resource: "finances", action: "view" },

  // Team Event permissions
  {
    role_id: PREDEFINED_IDS.roleTeamEvent,
    resource: "event",
    action: "create",
  },
  {
    role_id: PREDEFINED_IDS.roleTeamEvent,
    resource: "event",
    action: "update",
  },
  { role_id: PREDEFINED_IDS.roleTeamEvent, resource: "task", action: "assign" },
  {
    role_id: PREDEFINED_IDS.roleTeamEvent,
    resource: "participant",
    action: "manage",
  },
  {
    role_id: PREDEFINED_IDS.roleTeamEvent,
    resource: "expense",
    action: "create",
  },
  { role_id: PREDEFINED_IDS.roleTeamEvent, resource: "budget", action: "view" },

  // Team Medien permissions
  {
    role_id: PREDEFINED_IDS.roleTeamMedien,
    resource: "social_post",
    action: "create",
  },
  {
    role_id: PREDEFINED_IDS.roleTeamMedien,
    resource: "creator",
    action: "manage",
  },
  {
    role_id: PREDEFINED_IDS.roleTeamMedien,
    resource: "media",
    action: "upload",
  },
  {
    role_id: PREDEFINED_IDS.roleTeamMedien,
    resource: "newsletter",
    action: "create",
  },
  {
    role_id: PREDEFINED_IDS.roleTeamMedien,
    resource: "gallery",
    action: "manage",
  },

  // Team Technik permissions
  {
    role_id: PREDEFINED_IDS.roleTeamTechnik,
    resource: "system",
    action: "monitor",
  },
  {
    role_id: PREDEFINED_IDS.roleTeamTechnik,
    resource: "database",
    action: "backup",
  },
  {
    role_id: PREDEFINED_IDS.roleTeamTechnik,
    resource: "user",
    action: "support",
  },
  {
    role_id: PREDEFINED_IDS.roleTeamTechnik,
    resource: "integrations",
    action: "manage",
  },
  { role_id: PREDEFINED_IDS.roleTeamTechnik, resource: "logs", action: "view" },

  // Team Verein permissions
  {
    role_id: PREDEFINED_IDS.roleTeamVerein,
    resource: "email_template",
    action: "manage",
  },
  {
    role_id: PREDEFINED_IDS.roleTeamVerein,
    resource: "newsletter",
    action: "create",
  },
  { role_id: PREDEFINED_IDS.roleTeamVerein, resource: "faq", action: "manage" },
  {
    role_id: PREDEFINED_IDS.roleTeamVerein,
    resource: "document",
    action: "update",
  },

  // Mitglied permissions
  { role_id: PREDEFINED_IDS.roleMitglied, resource: "event", action: "read" },
  {
    role_id: PREDEFINED_IDS.roleMitglied,
    resource: "event",
    action: "register",
  },
  {
    role_id: PREDEFINED_IDS.roleMitglied,
    resource: "profile",
    action: "update",
  },
  {
    role_id: PREDEFINED_IDS.roleMitglied,
    resource: "event",
    action: "comment",
  },
  { role_id: PREDEFINED_IDS.roleMitglied, resource: "member", action: "view" },
  {
    role_id: PREDEFINED_IDS.roleMitglied,
    resource: "expense",
    action: "create",
  },
  { role_id: PREDEFINED_IDS.roleMitglied, resource: "task", action: "update" },
];

const seedPermissions = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Map to store permission IDs
    const permissionIds = new Map<string, string>();

    // 1. First create all unique permissions
    for (const perm of uniquePermissions) {
      const permissionId = generateId("prm");
      const key = `${perm.resource}-${perm.action}`;

      try {
        await connection.execute(
          `INSERT INTO permissions (
            id, resource, action, beschreibung
          ) VALUES (?, ?, ?, ?)`,
          [permissionId, perm.resource, perm.action, perm.description],
        );
        permissionIds.set(key, permissionId);
      } catch (error: any) {
        if (error.code === "ER_DUP_ENTRY") {
          // If permission already exists, get its ID
          const [existing] = await connection.execute(
            "SELECT id FROM permissions WHERE resource = ? AND action = ?",
            [perm.resource, perm.action],
          );
          if ((existing as any[]).length > 0) {
            permissionIds.set(key, (existing as any[])[0].id);
          }
        } else {
          throw error;
        }
      }
    }

    // 2. Then create role-permission mappings
    for (const mapping of rolePermissionMappings) {
      const key = `${mapping.resource}-${mapping.action}`;
      const permissionId = permissionIds.get(key);

      if (permissionId) {
        try {
          await connection.execute(
            `INSERT INTO role_permissions (
              role_id, permission_id
            ) VALUES (?, ?)`,
            [mapping.role_id, permissionId],
          );
        } catch (error: any) {
          if (error.code !== "ER_DUP_ENTRY") {
            throw error;
          }
          // Ignore duplicate entries
        }
      }
    }

    await connection.commit();
    console.log(
      `✅ ${uniquePermissions.length} Permissions and ${rolePermissionMappings.length} role mappings seeded successfully`,
    );
  } catch (error) {
    await connection.rollback();
    console.error("❌ Permissions seeding failed:", error);
    throw error;
  }
};

export default seedPermissions;
