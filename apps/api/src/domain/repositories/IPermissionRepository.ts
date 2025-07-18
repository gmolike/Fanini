import { Permission } from "../value-objects/Permission";

export interface IPermissionRepository {
  getPermissionsByRole(roleId: string): Promise<Permission[]>;
  getRoleHierarchy(): Promise<Record<string, string[]>>;
  roleHasPermission(roleId: string, permission: Permission): Promise<boolean>;
  addPermissionToRole(roleId: string, permission: Permission): Promise<void>;
  removePermissionFromRole(roleId: string, permission: Permission): Promise<void>;
}
