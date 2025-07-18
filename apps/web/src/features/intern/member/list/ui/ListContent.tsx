import { useState } from 'react';

import { CreateMemberDialog } from '@/features/intern/member/create';

import { useMemberListState } from '../lib/useMemberListState';

import { BulkActions } from './BulkActions';
import { ListTable } from './ListTable';
import { ListToolbar } from './ListToolbar';

/**
 * MemberListContent Component
 *
 * @description Hauptkomponente für die Mitgliederliste mit allen Features
 */
export const ListContent = () => {
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
      <ListToolbar
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

      <BulkActions
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

      <ListTable
        filters={filters}
        selectedMembers={selectedMembers}
        onMemberToggle={toggleMemberSelection}
      />

      <CreateMemberDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
};
