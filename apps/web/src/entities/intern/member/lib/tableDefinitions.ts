import type { MemberListItem } from '@/entities/intern/member';

import { createTableDefinition, DateCell } from '@/shared/ui/dataTable';

import { MemberNameCell } from '../ui/cells/MemberNameCell';
import { MemberRoleCell } from '../ui/cells/MemberRoleCell';
import { MemberStatusCell } from '../ui/cells/MemberStatusCell';

// Type-safe Labels
const memberLabels: Record<keyof MemberListItem | 'actions', string> = {
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

export const memberTableDefinition = createTableDefinition<MemberListItem>({
  labels: memberLabels,
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
