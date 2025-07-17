// widgets/intern/task/list/TaskListWidget.tsx
import { useState } from 'react';

import { useNavigate, useSearch } from '@tanstack/react-router';
import { LayoutGrid, List, Plus } from 'lucide-react';

import {
  type TaskFilter,
  type TaskListItem,
  taskTableDefinition,
  useTaskList,
} from '@/entities/intern/task';

import { Button, LoadingState, type ModernTabItem, ModernTabs, PageHeader } from '@/shared/ui';
import { DataTable } from '@/shared/ui/dataTable';

import { TaskCardView } from './ui/TaskCardView';
import { TaskFilters } from './ui/TaskFilters';

type ViewMode = 'list' | 'card';

type TaskListWidgetProps = {
  onCreateTask?: () => void;
  onEditTask?: (task: TaskListItem) => void;
  onDeleteTask?: (task: TaskListItem) => void;
  onViewTask?: (task: TaskListItem) => void;
};

// Search Schema für Type-Safety
type TaskSearchParams = {
  status?: string[];
  prioritaet?: string[];
  contextType?: string;
  contextId?: string;
  kategorie?: string;
};

/**
 * TaskListWidget Component
 *
 * @description Hauptwidget für die Aufgabenübersicht mit unterschiedlichen Ansichten
 * je nach Benutzerrolle (Admin/Beirat/Vorstand sehen alle Tasks)
 *
 * @param props - Widget Properties
 * @returns Rendered TaskListWidget
 */
export const TaskListWidget = ({
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onViewTask,
}: TaskListWidgetProps) => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/intern/tasks' });
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { user } = useAuthStore();

  const isAdmin = user?.rolle && ['ADMIN', 'VORSTAND', 'BEIRAT'].includes(user.rolle);

  // Filter State aus URL
  const filters: TaskFilter = {
    status: search.status as TaskFilter['status'],
    prioritaet: search.prioritaet as TaskFilter['prioritaet'],
    contextType: search.contextType as TaskFilter['contextType'],
    contextId: search.contextId || undefined,
    kategorie: search.kategorie || undefined,
    nurMeine: !isAdmin, // Normale Mitglieder sehen nur ihre Tasks
  };

  const updateFilters = (newFilters: Partial<TaskFilter>) => {
    // Build new search params
    const searchParams: TaskSearchParams = {};

    if (newFilters.status?.length) {
      searchParams.status = newFilters.status;
    }
    if (newFilters.prioritaet?.length) {
      searchParams.prioritaet = newFilters.prioritaet;
    }
    if (newFilters.contextType) {
      searchParams.contextType = newFilters.contextType;
    }
    if (newFilters.contextId) {
      searchParams.contextId = newFilters.contextId;
    }
    if (newFilters.kategorie) {
      searchParams.kategorie = newFilters.kategorie;
    }

    // Navigate with new search params
    void navigate({
      to: '/intern/tasks',
      search: searchParams,
    });
  };

  // Tab Content Component
  const TaskListContent = ({ taskFilters }: { taskFilters: TaskFilter }) => {
    const taskListQuery = useTaskList({ filters: taskFilters });

    return (
      <div className="space-y-4">
        <TaskFilters filters={taskFilters} onFiltersChange={updateFilters} showAdvanced={isAdmin} />

        <LoadingState query={taskListQuery}>
          {response =>
            viewMode === 'list' ? (
              <DataTable
                tableDefinition={taskTableDefinition}
                data={response.data}
                onRowClick={onViewTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                stickyHeader
                pageSize={20}
                searchPlaceholder="Aufgaben durchsuchen..."
              />
            ) : (
              <TaskCardView
                tasks={response.data}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onView={onViewTask}
              />
            )
          }
        </LoadingState>
      </div>
    );
  };

  // Tab Items für normale Mitglieder
  const memberTabs: ModernTabItem[] = [
    {
      value: 'my-tasks',
      label: 'Meine Aufgaben',
      shortLabel: 'Meine',
      icon: List,
      content: <TaskListContent taskFilters={{ ...filters, nurMeine: true }} />,
    },
    {
      value: 'team-tasks',
      label: 'Team-Aufgaben',
      shortLabel: 'Team',
      icon: List,
      content: <TaskListContent taskFilters={{ ...filters, contextType: 'team' }} />,
    },
  ];

  // Tab Items für Admins
  const adminTabs: ModernTabItem[] = [
    {
      value: 'all-tasks',
      label: 'Alle Aufgaben',
      shortLabel: 'Alle',
      icon: List,
      content: <TaskListContent taskFilters={filters} />,
    },
    {
      value: 'my-tasks',
      label: 'Meine Aufgaben',
      shortLabel: 'Meine',
      icon: List,
      content: <TaskListContent taskFilters={{ ...filters, nurMeine: true }} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Aufgabenverwaltung"
        description={
          isAdmin ? 'Übersicht aller Aufgaben im Verein' : 'Deine persönlichen und Team-Aufgaben'
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setViewMode(viewMode === 'list' ? 'card' : 'list');
              }}
              title={viewMode === 'list' ? 'Kartenansicht' : 'Listenansicht'}
            >
              {viewMode === 'list' ? (
                <LayoutGrid className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
            </Button>
            {onCreateTask ? (
              <Button size="sm" onClick={onCreateTask}>
                <Plus className="mr-2 h-4 w-4" />
                Neue Aufgabe
              </Button>
            ) : null}
          </div>
        }
      />

      <ModernTabs
        items={isAdmin ? adminTabs : memberTabs}
        defaultValue={isAdmin ? 'all-tasks' : 'my-tasks'}
      />
    </div>
  );
};
