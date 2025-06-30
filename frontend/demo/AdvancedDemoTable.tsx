// src/features/demo/AdvancedDemoTable.tsx

import {
  BooleanCell,
  type CellProps,
  createTableDefinition,
  DataTable,
  DateCell,
  EmailCell,
} from '@/shared/ui/dataTable';

type Project = {
  id: string;
  name: string;
  manager: string;
  managerEmail: string;
  startDate: Date;
  endDate: Date | null;
  isCompleted: boolean;
  budget: number;
  spent: number;
};

// Custom Cell für Budget mit Fortschrittsbalken
const BudgetCell = ({ row }: CellProps<Project>) => {
  const percentage = (row.spent / row.budget) * 100;
  const isOverBudget = percentage > 100;

  let progressBarColor = 'bg-green-600';
  if (isOverBudget) {
    progressBarColor = 'bg-red-600';
  } else if (percentage > 80) {
    progressBarColor = 'bg-yellow-600';
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{row.spent.toLocaleString('de-DE')}€</span>
        <span className="text-muted-foreground">/ {row.budget.toLocaleString('de-DE')}€</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className={`h-2 rounded-full ${progressBarColor}`}
          style={{ width: `${String(Math.min(percentage, 100))}%` }}
        />
      </div>
      <span className={`text-xs ${isOverBudget ? 'text-red-600' : ''}`}>
        {percentage.toFixed(0)}% verwendet
      </span>
    </div>
  );
};

// Table Definition
const projectTableDefinition = createTableDefinition<Project>({
  labels: {
    name: 'Projektname',
    manager: 'Projektleiter',
    managerEmail: 'E-Mail',
    startDate: 'Startdatum',
    endDate: 'Enddatum',
    isCompleted: 'Abgeschlossen',
    budget: 'Budget',
    actions: 'Aktionen',
    id: 'ID',
    spent: 'Ausgaben',
  },
  fields: [
    {
      id: 'name',
      sortable: true,
      searchable: true,
      width: 250,
    },
    {
      id: 'manager',
      sortable: true,
      searchable: true,
    },
    {
      id: 'managerEmail',
      cell: EmailCell,
    },
    {
      id: 'startDate',
      cell: DateCell,
      sortable: true,
    },
    {
      id: 'endDate',
      cell: DateCell,
      sortable: true,
    },
    {
      id: 'isCompleted',
      cell: BooleanCell,
      width: 120,
    },
    {
      id: 'budget',
      cell: BudgetCell,
      sortable: true,
      accessor: row => row.spent,
      width: 200,
    },
    {
      id: 'actions',
      cell: 'actions',
      toggleable: false,
    },
  ],
});

export const AdvancedDemoTable = () => {
  const projects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      manager: 'Sarah Connor',
      managerEmail: 's.connor@company.com',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      isCompleted: true,
      budget: 50000,
      spent: 48500,
    },
    {
      id: '2',
      name: 'Mobile App Development',
      manager: 'John Doe',
      managerEmail: 'j.doe@company.com',
      startDate: new Date('2024-03-15'),
      endDate: null,
      isCompleted: false,
      budget: 120000,
      spent: 95000,
    },
    {
      id: '3',
      name: 'API Integration',
      manager: 'Alice Smith',
      managerEmail: 'a.smith@company.com',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-30'),
      isCompleted: true,
      budget: 30000,
      spent: 28000,
    },
    {
      id: '4',
      name: 'Cloud Migration',
      manager: 'Bob Johnson',
      managerEmail: 'b.johnson@company.com',
      startDate: new Date('2024-05-01'),
      endDate: null,
      isCompleted: false,
      budget: 80000,
      spent: 45000,
    },
    {
      id: '5',
      name: 'Security Audit',
      manager: 'Sarah Connor',
      managerEmail: 's.connor@company.com',
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-05-15'),
      isCompleted: true,
      budget: 15000,
      spent: 14500,
    },
  ];

  const handleEdit = (project: Project) => {
    console.log('Edit project:', project);
  };

  const handleDelete = (project: Project) => {
    console.log('Delete project:', project);
  };

  return (
    <div className="p-8">
      <h2 className="mb-4 text-xl font-bold">Projekt-Übersicht</h2>

      <DataTable<Project>
        tableDefinition={projectTableDefinition}
        data={projects}
        // Features
        expandable
        initialRowCount={3}
        stickyHeader
        maxHeight="600px"
        pageSize={10}
        // Callbacks
        onEdit={handleEdit}
        onDelete={handleDelete}
        // UI Options
        searchPlaceholder="Suche nach Projekt oder Projektleiter..."
        showColumnToggle
        // Disabled columns (nicht ausblendbar)
        disabledColumns={['name', 'actions']}
      />
    </div>
  );
};
