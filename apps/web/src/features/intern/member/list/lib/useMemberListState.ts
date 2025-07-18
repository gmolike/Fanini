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

  // Safely destructure useUserPermissions, handling tuple or error values
  const userPermissionsResult = useUserPermissions();
  type PermissionsType = { data?: { role?: string } };
  let permissions: { role?: string } | undefined;

  if (Array.isArray(userPermissionsResult)) {
    const first = userPermissionsResult[0] as PermissionsType | undefined;
    permissions = first?.data;
  } else if (typeof userPermissionsResult === 'object' && 'data' in userPermissionsResult) {
    permissions = (userPermissionsResult as PermissionsType).data;
  } else {
    permissions = undefined;
  }

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

  // Bulk Actions
  const executeBulkAction = useCallback(
    (payload: BulkActionPayload) => {
      setBulkActionLoading(true);
      try {
        console.log('Executing bulk action:', payload);
        toast.success('Bulk-Aktion erfolgreich ausgeführt');
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
