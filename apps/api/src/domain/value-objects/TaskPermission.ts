// apps/api/src/domain/value-objects/TaskPermission.ts

/**
 * Task-spezifische Berechtigung
 */
export type TaskPermission = {
  readonly resource: 'task';
  readonly action: TaskAction;
  readonly scope?: TaskScope;
};

export type TaskAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'assign'
  | 'change_status'
  | 'comment';

export type TaskScope =
  | { type: 'own' }
  | { type: 'team'; teamId: string }
  | { type: 'event'; eventId: string }
  | { type: 'all' };

/**
 * Erstellt eine Task-Permission
 */
export const createTaskPermission = (
  action: TaskAction,
  scope?: TaskScope
): TaskPermission => ({
  resource: 'task',
  action,
  scope
});

/**
 * Prüft ob Permission eine andere impliziert
 */
export const taskPermissionImplies = (
  permission: TaskPermission,
  required: TaskPermission
): boolean => {
  if (permission.action !== required.action) return false;

  // All impliziert alles
  if (permission.scope?.type === 'all') return true;

  // Gleicher Scope
  if (permission.scope?.type === required.scope?.type) {
    if (permission?.scope?.type === 'team' && required.scope?.type === 'team') {
      return permission.scope.teamId === required.scope.teamId;
    }
    if (permission?.scope?.type === 'event' && required.scope?.type === 'event') {
      return permission.scope.eventId === required.scope.eventId;
    }
    return true;
  }

  return false;
};
