// apps/web/src/features/intern/member/list/ui/ListTable.tsx
import { useMemo } from 'react';

import { useNavigate } from '@tanstack/react-router';

import {
  type MemberListFilters,
  type MemberListItem,
  useMemberList,
} from '@/entities/intern/member';

import { type CellProps, createTableDefinition, DataTable, DateCell } from '@/shared/ui';

// Inline Cell Components
const MemberNameCell = ({ row }: CellProps<MemberListItem>) => {
  const initials = `${row.vorname.charAt(0)}${row.nachname.charAt(0)}`.toUpperCase();
  const fullName = `${row.vorname} ${row.nachname}`;

  return (
    <div className="flex items-center gap-3">
      <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
        <span className="text-xs font-medium">{initials}</span>
      </div>
      <div>
        <div className="font-medium">{fullName}</div>
        <div className="text-muted-foreground text-sm">{row.mitgliedsnummer}</div>
      </div>
    </div>
  );
};

const MemberRoleCell = ({ row }: CellProps<MemberListItem>) => {
  const roles = row.rolle;
  const displayRoles = roles.slice(0, 2);
  const remainingCount = roles.length - displayRoles.length;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {displayRoles.map(role => (
        <span
          key={role}
          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
        >
          {role}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="text-muted-foreground text-xs">+{remainingCount}</span>
      )}
    </div>
  );
};

const MemberStatusCell = ({ row }: CellProps<MemberListItem>) => {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
        row.istAktiv
          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
          : 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
      }`}
    >
      {row.istAktiv ? 'Aktiv' : 'Inaktiv'}
    </span>
  );
};

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

  // Erstelle die TableDefinition inline
  const tableDefinition = useMemo(() => {
    const labels: Record<keyof MemberListItem | 'actions', string> = {
      id: 'ID',
      vorname: 'Vorname',
      nachname: 'Nachname',
      vollstaendigerName: 'Name',
      email: 'E-Mail',
      telefon: 'Telefon',
      mitgliedsnummer: 'Mitgliedsnr.',
      istAktiv: 'Status',
      mitgliedSeit: 'Mitglied seit',
      geburtsdatum: 'Geburtsdatum',
      rolle: 'Rolle(n)',
      profilbild: 'Profilbild',
      letzteAktivitaet: 'Letzte Aktivität',
      actions: 'Aktionen',
    };

    return createTableDefinition<MemberListItem>({
      labels,
      fields: [
        {
          id: 'vollstaendigerName',
          cell: MemberNameCell,
          searchable: true,
          toggleable: false,
          accessor: row => `${row.vorname} ${row.nachname}`,
        },
        {
          id: 'email',
          searchable: true,
        },
        {
          id: 'telefon',
          defaultVisible: false,
        },
        {
          id: 'rolle',
          cell: MemberRoleCell,
          filterable: true,
        },
        {
          id: 'istAktiv',
          cell: MemberStatusCell,
          filterable: true,
          width: 100,
        },
        {
          id: 'mitgliedsnummer',
          defaultVisible: false,
          searchable: true,
        },
        {
          id: 'mitgliedSeit',
          cell: DateCell,
          width: 120,
        },
        {
          id: 'letzteAktivitaet',
          cell: DateCell,
          defaultVisible: false,
        },
        {
          id: 'actions',
          width: 100,
          sortable: false,
        },
      ],
    });
  }, []);

  const handleRowClick = (member: MemberListItem) => {
    void navigate({
      to: '/intern/member/detail/$memberId',
      params: { memberId: member.id },
    });
  };

  const typedData =
    data?.data.map(item => ({
      ...item,
      rolle: item.rolle as MemberListItem['rolle'],
    })) ?? [];

  return (
    <DataTable
      tableDefinition={tableDefinition}
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
