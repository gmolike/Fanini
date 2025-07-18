// apps/web/src/features/intern/member/list/ui/ListContent.tsx
import { toast } from 'sonner';

import { useMemberListState } from '../lib/useMemberListState';

import { BulkActions } from './BulkActions';
import { ListTable } from './ListTable';
import { ListToolbar } from './ListToolbar';

/**
 * ListContent Component
 *
 * @description Hauptkomponente für die Mitgliederliste mit allen Features
 */
export const ListContent = () => {
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
    // Implement export functionality
    toast.info('Export-Funktion wird implementiert');
  };

  return (
    <div className="space-y-4">
      <ListToolbar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        onExportClick={canExportMembers ? handleExport : undefined}
        canExport={canExportMembers}
        isFiltered={isFiltered}
      />

      <BulkActions
        selectedCount={selectedMembers.size}
        onBulkAction={(action, data) => {
          void executeBulkAction({
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
    </div>
  );
};
