// apps/api/src/infrastructure/repositories/MySQLPermissionRepository.ts
import type { IPermissionRepository } from "@/domain/repositories/IPermissionRepository";
import type { MySQLConnection } from "./MySQLConnection";
import type { Permission } from "@/domain/value-objects/Permission";
import { generateId } from "@faninitiative/shared";

/**
 * MySQL Implementation des Permission Repository
 * @description Verwaltet Berechtigungen in der MySQL Datenbank
 */
export class MySQLPermissionRepository implements IPermissionRepository {
  constructor(private readonly db: MySQLConnection) {}

  /**
   * Lädt alle Permissions für eine Rolle
   */
  async getPermissionsByRole(roleId: string): Promise<Permission[]> {
    const rows = await this.db.query<any[]>(
      `SELECT p.resource, p.action, p.conditions
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [roleId],
    );

    return rows.map((row) => ({
      resource: row.resource,
      action: row.action,
      conditions: row.conditions ? JSON.parse(row.conditions) : undefined,
    }));
  }

  /**
   * Lädt die komplette Rollenhierarchie
   */
  async getRoleHierarchy(): Promise<Record<string, string[]>> {
    const rows = await this.db.query<any[]>(
      `SELECT parent_role_id, child_role_id FROM role_hierarchy`,
    );

    const hierarchy: Record<string, string[]> = {};

    for (const row of rows) {
      if (!hierarchy[row.parent_role_id]) {
        hierarchy[row.parent_role_id] = [];
      }
      hierarchy[row.parent_role_id].push(row.child_role_id);
    }

    return hierarchy;
  }

  /**
   * Prüft ob eine Rolle eine spezifische Permission hat
   */
  async roleHasPermission(
    roleId: string,
    permission: Permission,
  ): Promise<boolean> {
    // Direkte Permission prüfen
    const directPermission = await this.checkDirectPermission(
      roleId,
      permission,
    );
    if (directPermission) return true;

    // Wildcard Permissions prüfen
    const hasWildcard = await this.checkWildcardPermission(roleId, permission);
    if (hasWildcard) return true;

    // Hierarchie prüfen (erbt Permissions von Parent-Rollen)
    const hierarchy = await this.getRoleHierarchy();
    const parentRoles = await this.getParentRoles(roleId, hierarchy);

    for (const parentRole of parentRoles) {
      const parentHasPermission = await this.checkDirectPermission(
        parentRole,
        permission,
      );
      if (parentHasPermission) return true;
    }

    return false;
  }

  /**
   * Fügt eine Permission zu einer Rolle hinzu
   */
  async addPermissionToRole(
    roleId: string,
    permission: Permission,
  ): Promise<void> {
    // Transaction starten
    const connection = await this.db.getConnection();
    await connection.beginTransaction();

    try {
      // Permission ID finden oder erstellen
      let permissionId = await this.findPermissionId(permission);

      if (!permissionId) {
        permissionId = await this.createPermission(permission);
      }

      // Rolle-Permission Verknüpfung erstellen
      await connection.query(
        `INSERT IGNORE INTO role_permissions (role_id, permission_id)
         VALUES (?, ?)`,
        [roleId, permissionId],
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Entfernt eine Permission von einer Rolle
   */
  async removePermissionFromRole(
    roleId: string,
    permission: Permission,
  ): Promise<void> {
    await this.db.query(
      `DELETE rp FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?
       AND p.resource = ?
       AND p.action = ?`,
      [roleId, permission.resource, permission.action],
    );
  }

  /**
   * Private Helper: Direkte Permission prüfen
   */
  private async checkDirectPermission(
    roleId: string,
    permission: Permission,
  ): Promise<boolean> {
    const rows = await this.db.query<any[]>(
      `SELECT COUNT(*) as count
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?
       AND p.resource = ?
       AND p.action = ?`,
      [roleId, permission.resource, permission.action],
    );

    return rows[0].count > 0;
  }

  /**
   * Private Helper: Wildcard Permission prüfen
   */
  private async checkWildcardPermission(
    roleId: string,
    permission: Permission,
  ): Promise<boolean> {
    // Prüfe resource.* wildcard
    const resourceWildcard = await this.db.query<any[]>(
      `SELECT COUNT(*) as count
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?
       AND p.resource = ?
       AND p.action = '*'`,
      [roleId, permission.resource],
    );

    if (resourceWildcard[0].count > 0) return true;

    // Prüfe *.* wildcard
    const fullWildcard = await this.db.query<any[]>(
      `SELECT COUNT(*) as count
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?
       AND p.resource = '*'
       AND p.action = '*'`,
      [roleId],
    );

    return fullWildcard[0].count > 0;
  }

  /**
   * Private Helper: Parent Rollen ermitteln
   */
  private async getParentRoles(
    roleId: string,
    hierarchy: Record<string, string[]>,
  ): Promise<string[]> {
    const parents: string[] = [];

    for (const [parent, children] of Object.entries(hierarchy)) {
      if (children.includes(roleId)) {
        parents.push(parent);
        // Rekursiv auch Großeltern-Rollen holen
        const grandparents = await this.getParentRoles(parent, hierarchy);
        parents.push(...grandparents);
      }
    }

    return [...new Set(parents)]; // Duplikate entfernen
  }

  /**
   * Private Helper: Permission ID finden
   */
  private async findPermissionId(
    permission: Permission,
  ): Promise<string | null> {
    const rows = await this.db.query<any[]>(
      `SELECT id FROM permissions
       WHERE resource = ? AND action = ?`,
      [permission.resource, permission.action],
    );

    return rows[0]?.id || null;
  }

  /**
   * Private Helper: Permission erstellen
   */
  private async createPermission(permission: Permission): Promise<string> {
    const permissionId = `perm_${generateId()}`;

    await this.db.query(
      `INSERT INTO permissions (id, resource, action, conditions, beschreibung)
       VALUES (?, ?, ?, ?, ?)`,
      [
        permissionId,
        permission.resource,
        permission.action,
        permission.conditions ? JSON.stringify(permission.conditions) : null,
        `${permission.resource}.${permission.action}`,
      ],
    );

    return permissionId;
  }
}
