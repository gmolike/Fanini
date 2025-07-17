// entities/intern/task/ui/taskTableDefinition.ts
import { createTableDefinition, DateCell } from '@/shared/ui/dataTable';

import { TaskAssigneesCell } from '../ui/cells/TaskAssigneesCell';
import { TaskContextCell } from '../ui/cells/TaskContextCell';
import { TaskPriorityCell } from '../ui/cells/TaskPriorityCell';
import { TaskStatusCell } from '../ui/cells/TaskStatusCell';
import { TaskTitleCell } from '../ui/cells/TaskTitleCell';

import type { TaskListItem } from './types';

// Type-safe Labels
const taskLabels: Record<keyof TaskListItem | 'actions', string> = {
  id: 'ID',
  titel: 'Aufgabe',
  beschreibung: 'Beschreibung',
  contextType: 'Kontext',
  contextId: 'Kontext-ID',
  verantwortlichId: 'Verantwortlicher ID',
  verantwortlicher: 'Verantwortlich',
  zugewiesenAn: 'Zugewiesen IDs',
  zugewiesenePersonen: 'Zugewiesen an',
  status: 'Status',
  prioritaet: 'Priorität',
  frist: 'Fälligkeitsdatum',
  kategorie: 'Kategorie',
  erstelltAm: 'Erstellt',
  istStandardaufgabe: 'Vorlage',
  actions: 'Aktionen',
  erledigtAm: 'Erledigt am',
};

/**
 * Table Definition für Task List
 *
 * Defaults:
 * - sortable: true (für alle außer actions)
 * - searchable: false
 * - filterable: false
 * - toggleable: true
 * - defaultVisible: true
 */
export const taskTableDefinition = createTableDefinition<TaskListItem>({
  labels: taskLabels,
  fields: [
    {
      id: 'titel',
      cell: TaskTitleCell,
      searchable: true,
      toggleable: false, // Titel immer sichtbar
    },
    {
      id: 'status',
      cell: TaskStatusCell,
      filterable: true,
    },
    {
      id: 'prioritaet',
      cell: TaskPriorityCell,
      filterable: true,
    },
    {
      id: 'contextType',
      cell: TaskContextCell,
      filterable: true,
      defaultVisible: false,
    },
    {
      id: 'verantwortlicher',
      accessor: row => row.verantwortlicher?.name ?? '-',
      defaultVisible: false,
    },
    {
      id: 'zugewiesenePersonen',
      cell: TaskAssigneesCell,
      searchable: true,
      sortable: false, // Macht bei Arrays keinen Sinn
    },
    {
      id: 'frist',
      cell: DateCell,
    },
    {
      id: 'kategorie',
      filterable: true,
      defaultVisible: false,
    },
    {
      id: 'erstelltAm',
      cell: DateCell,
      defaultVisible: false,
    },
    {
      id: 'actions',
      width: 100,
      sortable: false, // Actions sind nie sortierbar
    },
  ],
});
