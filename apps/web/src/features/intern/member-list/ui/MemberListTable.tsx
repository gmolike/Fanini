import { useNavigate } from '@tanstack/react-router';

import {
  type MemberListItem,
  memberTableDefinition,
  useMemberList,
} from '@/entities/intern/member';

import { DataTable } from '@/shared/ui/dataTable';

import type { MemberListFilters } from '../model/types';

type MemberListTableProps = {
  filters: MemberListFilters;
  selectedMembers: Set<string>;
  onMemberToggle: (memberId: string) => void;
  onEdit?: (member: MemberListItem) => void;
  onDelete?: (member: MemberListItem) => void;
};

/**
 * MemberListTable Component
 *
 * @description Tabelle mit Mitgliederdaten unter Verwendung der shared DataTable
 */
export const MemberListTable = ({
  filters,
  selectedMembers,
  onMemberToggle,
  onEdit,
  onDelete,
}: MemberListTableProps) => {
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useMemberList({
    filters: {
      active: filters.active,
      search: filters.search,
      roleId: filters.roleId,
      page: filters.page,
      limit: filters.limit,
    },
  });

  const handleRowClick = (member: MemberListItem) => {
    void navigate({
      to: '/intern/member/detail/$memberId',
      params: { memberId: member.id },
    });
  };

  return (
    <DataTable
      tableDefinition={memberTableDefinition}
      data={data?.data ?? []}
      isLoading={isLoading}
      error={error}
      onRowClick={handleRowClick}
      onEdit={onEdit}
      onDelete={onDelete}
      onRetry={() => void refetch()}
      showColumnToggle
      stickyHeader
      stickyActionColumn
      pageSize={filters.limit}
      maxHeight="600px"
    />
  );
};
