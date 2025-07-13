 
 
 
/* eslint-disable no-console */
// frontend/src/shared/ui/dataTable/DataTable.stories.tsx
import { expect, userEvent, within } from '@storybook/test';

import { createTableDefinition } from './model/types';
import { BooleanCell, DateCell, EmailCell } from './ui/cells';
import { DataTable } from './ui/DataTable';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * @description DataTable Komponente für tabellarische Darstellung von Daten
 * mit umfangreichen Features wie Sortierung, Filterung, Pagination und mehr
 */
const meta: Meta<typeof DataTable<User>> = {
  title: 'dataTable',
  component: DataTable as typeof DataTable<User>,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data types
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: string;
};

// Sample data
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Max Mustermann',
    email: 'max@example.com',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Erika Musterfrau',
    email: 'erika@example.com',
    role: 'user',
    isActive: true,
    createdAt: '2024-02-20T14:45:00Z',
  },
  {
    id: '3',
    name: 'Hans Schmidt',
    email: 'hans@example.com',
    role: 'moderator',
    isActive: false,
    createdAt: '2024-03-10T09:15:00Z',
  },
  // Mehr Beispieldaten für Pagination
  ...Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 4),
    name: `User ${(i + 4).toString()}`,
    email: `user${String(i + 4)}@example.com`,
    role: 'user' as const,
    isActive: i % 2 === 0,
    createdAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
  })),
];

// Table definition
const userTableDefinition = createTableDefinition<User>({
  labels: {
    name: 'Name',
    email: 'E-Mail',
    role: 'Rolle',
    isActive: 'Aktiv',
    createdAt: 'Erstellt am',
    actions: 'Aktionen',
    id: '',
  },
  fields: [
    { id: 'name', sortable: true, searchable: true },
    { id: 'email', cell: EmailCell, sortable: true },
    { id: 'role', sortable: true, filterable: true },
    { id: 'isActive', cell: BooleanCell },
    { id: 'createdAt', cell: DateCell, sortable: true },
    { id: 'actions' },
  ],
});

/**
 * @description Basis-Tabelle mit allen Features
 */
export const Default: Story = {
  args: {
    tableDefinition: userTableDefinition,
    data: sampleUsers,
    onEdit: user => {
      console.log('Edit:', user);
    },
    onDelete: user => {
      console.log('Delete:', user);
    },
    onAdd: () => {
      console.log('Add new user');
    },
    addButtonText: 'Neuer Benutzer',
  },
};

/**
 * @description Tabelle im Loading-Zustand
 */
export const Loading: Story = {
  args: {
    tableDefinition: userTableDefinition,
    data: [],
    isLoading: true,
  },
};

/**
 * @description Tabelle mit Fehlerzustand
 */
export const ErrorValue: Story = {
  args: {
    tableDefinition: userTableDefinition,
    data: [],
    error: new Error('Fehler beim Laden der Daten'),
    onRetry: () => {
      console.log('Retry loading');
    },
  },
};

/**
 * @description Leere Tabelle
 */
export const Empty: Story = {
  args: {
    tableDefinition: userTableDefinition,
    data: [],
  },
};

/**
 * @description Expandierbare Tabelle (Dashboard-Ansicht)
 */
export const Expandable: Story = {
  args: {
    tableDefinition: userTableDefinition,
    data: sampleUsers,
    expandable: true,
    initialRowCount: 3,
    expandButtonText: {
      expand: 'Alle Benutzer anzeigen',
      collapse: 'Weniger anzeigen',
    },
  },
};

/**
 * @description Tabelle mit Sticky Header und Action Column
 */
export const StickyFeatures: Story = {
  args: {
    tableDefinition: userTableDefinition,
    data: sampleUsers,
    stickyHeader: true,
    stickyActionColumn: true,
    maxHeight: '400px',
    onEdit: user => {
      console.log('Edit:', user);
    },
    onDelete: user => {
      console.log('Delete:', user);
    },
  },
};

/**
 * @description Tabelle mit ausgewählter Zeile
 */
export const WithSelectedRow: Story = {
  args: {
    tableDefinition: userTableDefinition,
    data: sampleUsers,
    selectedId: '3',
    onRowClick: user => {
      console.log('Row clicked:', user);
    },
  },
};

/**
 * @description Interaktiver Test
 */
export const Interactive: Story = {
  args: {
    tableDefinition: userTableDefinition,
    data: sampleUsers,
    onEdit: user => {
      console.log('Edit:', user);
    },
    onDelete: user => {
      console.log('Delete:', user);
    },
    onAdd: () => {
      console.log('Add new user');
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test search
    const searchInput = canvas.getByPlaceholderText('Suche...');
    await userEvent.type(searchInput, 'Max');

    // Verify search results
    await expect(canvas.getByText('Max Mustermann')).toBeInTheDocument();

    // Clear search
    await userEvent.clear(searchInput);

    // Test column toggle
    const columnToggle = canvas.getByRole('button', { name: /settings/i });
    await userEvent.click(columnToggle);

    // Wait for dropdown to appear
    await expect(canvas.getByText('Sichtbare Spalten')).toBeInTheDocument();

    // Close dropdown by clicking outside
    await userEvent.click(document.body);

    // Test sorting
    const nameHeader = canvas.getByRole('button', { name: /name/i });
    await userEvent.click(nameHeader);

    // Test pagination if visible
    const nextButton = canvas.queryByRole('button', { name: /nächste seite/i });
    if (nextButton !== null) {
      await userEvent.click(nextButton);
    }
  },
};

/**
 * @description Tabelle mit benutzerdefinierten Spalten
 */
export const SelectableColumns: Story = {
  args: {
    tableDefinition: userTableDefinition,
    data: sampleUsers,
    selectableColumns: ['name', 'email', 'isActive', 'actions'],
    disabledColumns: ['name'], // Name kann nicht ausgeblendet werden
  },
};

/**
 * @description Kompakte Tabelle für Dashboards
 */
export const CompactDashboard: Story = {
  args: {
    tableDefinition: userTableDefinition,
    data: sampleUsers.slice(0, 5),
    expandable: true,
    initialRowCount: 3,
    showColumnToggle: false,
    pageSize: 5,
    maxHeight: '300px',
    containerClassName: 'shadow-sm',
  },
};
