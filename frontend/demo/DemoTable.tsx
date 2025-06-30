// src/features/demo/DemoTable.tsx

import { useState } from 'react';

import {
  BooleanCell,
  createTableDefinition,
  DataTable,
  DateCell,
  EmailCell,
  PhoneCell,
  TextCell,
} from '@/shared/ui/dataTable;

// Datentyp definieren
type DemoUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  role: 'admin' | 'user' | 'moderator';
  department: string;
  lastLogin: string | null;
};

// Mock-Daten
const mockUsers: DemoUser[] = [
  {
    id: '1',
    name: 'Max Mustermann',
    email: 'max@example.com',
    phone: '+49 30 12345678',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    role: 'admin',
    department: 'IT',
    lastLogin: '2025-01-10T14:30:00',
  },
  {
    id: '2',
    name: 'Anna Schmidt',
    email: 'anna.schmidt@example.com',
    phone: null,
    isActive: true,
    createdAt: new Date('2024-02-20'),
    role: 'user',
    department: 'Marketing',
    lastLogin: '2025-01-09T09:15:00',
  },
  {
    id: '3',
    name: 'Peter Weber',
    email: 'p.weber@example.com',
    phone: '+49 40 98765432',
    isActive: false,
    createdAt: new Date('2023-11-10'),
    role: 'moderator',
    department: 'Support',
    lastLogin: null,
  },
  {
    id: '4',
    name: 'Lisa Müller',
    email: 'lisa.mueller@example.com',
    phone: '+49 89 55667788',
    isActive: true,
    createdAt: new Date('2024-05-05'),
    role: 'user',
    department: 'Sales',
    lastLogin: '2025-01-10T16:45:00',
  },
  {
    id: '5',
    name: 'Tom Fischer',
    email: 'tom.f@example.com',
    phone: null,
    isActive: false,
    createdAt: new Date('2024-07-20'),
    role: 'user',
    department: 'HR',
    lastLogin: '2024-12-20T11:30:00',
  },
];

// Custom Cell Component für Role Badge
const RoleBadge = ({ value }: { value: unknown }) => {
  const role = value as DemoUser['role'];
  const colors = {
    admin: 'bg-red-100 text-red-800',
    moderator: 'bg-blue-100 text-blue-800',
    user: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[role]}`}
    >
      {role}
    </span>
  );
};

// Table Definition
const userTableDefinition = createTableDefinition<DemoUser>({
  labels: {
    id: 'ID',
    name: 'Name',
    email: 'E-Mail',
    phone: 'Telefon',
    isActive: 'Status',
    createdAt: 'Erstellt am',
    role: 'Rolle',
    department: 'Abteilung',
    lastLogin: 'Letzter Login',
    actions: 'Aktionen',
  },
  fields: [
    {
      id: 'name',
      sortable: true,
      searchable: true,
      cell: TextCell, // Explizit TextCell
    },
    {
      id: 'email',
      sortable: true,
      searchable: true,
      cell: EmailCell, // EmailCell mit Icon
    },
    {
      id: 'phone',
      sortable: false,
      cell: PhoneCell, // PhoneCell mit Formatierung
    },
    {
      id: 'isActive',
      sortable: true,
      cell: BooleanCell, // BooleanCell mit Checkmark/X
      width: 100,
    },
    {
      id: 'createdAt',
      sortable: true,
      cell: DateCell, // DateCell mit Datumsformatierung
    },
    {
      id: 'role',
      sortable: true,
      filterable: true,
      cell: RoleBadge, // Custom Cell Component
    },
    {
      id: 'department',
      sortable: true,
      searchable: true,
      // Keine cell angegeben = default TextCell
    },
    {
      id: 'lastLogin',
      sortable: true,
      cell: DateCell, // DateCell auch für Timestamps
    },
    {
      id: 'actions',
      cell: 'actions', // Actions Cell mit Edit/Delete
      toggleable: false, // Actions sind immer sichtbar
      width: 120,
    },
  ],
});

// Demo Component
export const DemoTable = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Simulate loading
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random error
    // eslint-disable-next-line sonarjs/pseudo-random
    if (Math.random() > 0.7) {
      setError(new Error('Fehler beim Laden der Daten'));
    }

    setIsLoading(false);
  };

  // Handlers
  const handleRowClick = (user: DemoUser) => {
    setSelectedUserId(user.id);
    console.log('Row clicked:', user);
  };

  const handleEdit = (user: DemoUser) => {
    console.log('Edit user:', user);
    // Hier würde man z.B. einen Edit-Dialog öffnen
  };

  const handleDelete = (user: DemoUser) => {
    console.log('Delete user:', user);
    // Hier würde man z.B. einen Confirm-Dialog zeigen
  };

  const handleAdd = () => {
    console.log('Add new user');
    // Hier würde man z.B. einen Create-Dialog öffnen
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">DataTable Demo - Alle Cell Types</h1>
        <button
          onClick={handleRefresh}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Daten neu laden
        </button>
      </div>

      <DataTable
        tableDefinition={userTableDefinition}
        data={mockUsers}
        // State
        isLoading={isLoading}
        error={error}
        selectedId={selectedUserId ?? ''}
        // Callbacks
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        onRetry={handleRefresh}
        // UI Options
        searchPlaceholder="Suche nach Name, E-Mail oder Abteilung..."
        addButtonText="Neuer Benutzer"
        showColumnToggle
        showColumnToggleText={false}
        // Features
        expandable
        initialRowCount={3}
        stickyHeader
        pageSize={10}
        // Optional: Nur bestimmte Spalten anzeigen
        // selectableColumns={['name', 'email', 'isActive', 'role', 'actions']}

        // Optional: Bestimmte Spalten deaktivieren (nicht ausblendbar)
        disabledColumns={['name', 'actions']}
      />

      {selectedUserId ? (
        <div className="mt-4 rounded bg-gray-100 p-4">
          <p className="text-sm">
            Ausgewählter Benutzer ID: <strong>{selectedUserId}</strong>
          </p>
        </div>
      ) : null}
    </div>
  );
};
