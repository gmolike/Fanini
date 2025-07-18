import { useState } from 'react';

import { CreateMemberDialog } from '@/features/intern/member-create';

import { useMemberListState } from '../lib/use-member-list-state';

import { MemberBulkActions } from './MemberBulkActions';
import { MemberListTable } from './MemberListTable';
import { MemberListToolbar } from './MemberListToolbar';

/**
 * MemberListContent Component
 *
 * @description Hauptkomponente für die Mitgliederliste mit allen Features
 */
export const MemberListContent = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const {
    filters,
    selectedMembers,
    bulkActionLoading,
    updateFilter,
    resetFilters,
    toggleMemberSelection,
    executeBulkAction,
    canBulkAssignRoles,
    canExportMembers,
  } = useMemberListState();

  const isFiltered =
    filters.search !== '' || filters.roleId !== undefined || filters.active !== true;

  const handleExport = () => {
    console.log('Export members with filters:', filters);
    // TODO: Implement export functionality
  };

  return (
    <div className="space-y-4">
      <MemberListToolbar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        onCreateClick={() => {
          setCreateDialogOpen(true);
        }}
        onExportClick={canExportMembers ? handleExport : undefined}
        canExport={canExportMembers}
        isFiltered={isFiltered}
      />

      <MemberBulkActions
        selectedCount={selectedMembers.size}
        onBulkAction={(action, data) => {
          executeBulkAction({
            action,
            memberIds: Array.from(selectedMembers),
            data,
          });
        }}
        canAssignRoles={canBulkAssignRoles}
        isLoading={bulkActionLoading}
      />

      <MemberListTable
        filters={filters}
        selectedMembers={selectedMembers}
        onMemberToggle={toggleMemberSelection}
      />

      <CreateMemberDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
};
