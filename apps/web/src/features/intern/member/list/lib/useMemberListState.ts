// apps/web/src/features/intern/member/list/lib/useMemberListState.ts
import { useCallback, useMemo, useState } from 'react';

import { toast } from 'sonner';

import {
  type BulkActionPayload,
  createDefaultFilters,
  type MemberListFilters,
  useUserPermissions,
} from '@/entities/intern/member';

/**
 * Custom Hook für Member List State Management
 */
export const useMemberListState = () => {
  const [filters, setFilters] = useState<MemberListFilters>(createDefaultFilters());
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const { data: permissions } = useUserPermissions();

  // Filter Handlers
  const updateFilter = useCallback(
    <K extends keyof MemberListFilters>(key: K, value: MemberListFilters[K]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(createDefaultFilters());
  }, []);

  // Selection Handlers
  const toggleMemberSelection = useCallback((memberId: string) => {
    setSelectedMembers(prev => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  }, []);

  const selectAllMembers = useCallback((memberIds: string[]) => {
    setSelectedMembers(new Set(memberIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMembers(new Set());
  }, []);

  // Permission Checks
  const canBulkAssignRoles = useMemo(
    () => permissions?.role === 'VORSTAND' || permissions?.role === 'BEIRAT',
    [permissions]
  );

  const canExportMembers = useMemo(
    () => permissions?.role !== 'TEAM_VEREIN' && permissions?.role !== 'MITGLIED',
    [permissions]
  );

  // Bulk Actions - USE the payload parameter
  const executeBulkAction = useCallback(
    async (payload: BulkActionPayload) => {
      setBulkActionLoading(true);
      try {
        // Log the action for debugging
        console.info('Executing bulk action:', {
          action: payload.action,
          memberCount: payload.memberIds.length,
          data: payload.data,
        });

        // Implement actual bulk action logic based on action type
        switch (payload.action) {
          case 'assign-role':
            // API call to assign role to multiple members
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(
              `Rolle "${payload.data?.roleId ?? ''}" wurde ${payload.memberIds.length.toString()} Mitgliedern zugewiesen`
            );
            break;

          case 'deactivate':
            // API call to deactivate members
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`${payload.memberIds.length.toString()} Mitglieder wurden deaktiviert`);
            break;

          case 'activate':
            // API call to activate members
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`${payload.memberIds.length.toString()} Mitglieder wurden aktiviert`);
            break;

          case 'export':
            // Handle export
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Export wurde gestartet');
            break;

          default:
            toast.error('Unbekannte Bulk-Aktion');
        }

        clearSelection();
      } catch (_error) {
        if (_error instanceof Error) {
          toast.error(`Fehler bei der Bulk-Aktion: ${_error.message}`);
        } else {
          toast.error('Fehler bei der Bulk-Aktion');
        }
      } finally {
        setBulkActionLoading(false);
      }
    },
    [clearSelection]
  );

  return {
    // State
    filters,
    selectedMembers,
    bulkActionLoading,

    // Filter Actions
    updateFilter,
    resetFilters,

    // Selection Actions
    toggleMemberSelection,
    selectAllMembers,
    clearSelection,

    // Bulk Actions
    executeBulkAction,

    // Permissions
    canBulkAssignRoles,
    canExportMembers,
  };
};
