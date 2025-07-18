import { useNavigate } from '@tanstack/react-router';

import {
  type MemberListFilters,
  type MemberListItem,
  memberTableDefinition,
  useMemberList,
} from '@/entities/intern/member';

import { DataTable } from '@/shared/ui/dataTable';

type ListTableProps = {
  filters: MemberListFilters;
  selectedMembers: Set<string>;
  onMemberToggle: (memberId: string) => void;
  onEdit?: (member: MemberListItem) => void;
  onDelete?: (member: MemberListItem) => void;
};

export const ListTable = ({ filters, onEdit, onDelete }: ListTableProps) => {
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

  // Cast rolle to MemberRole[]
  const typedData =
    data?.data.map(item => ({
      ...item,
      rolle: item.rolle as MemberListItem['rolle'],
    })) ?? [];

  return (
    <DataTable
      tableDefinition={memberTableDefinition}
      data={typedData}
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
