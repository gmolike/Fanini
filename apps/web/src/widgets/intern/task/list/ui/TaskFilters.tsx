// widgets/intern/task/list/ui/TaskFilters.tsx
import { Filter, X } from 'lucide-react';

import {
  TASK_CONTEXT_CONFIG,
  TASK_PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
  type TaskFilter,
} from '@/entities/intern/task';

import {
  Badge,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn';

type TaskFiltersProps = {
  filters: TaskFilter;
  onFiltersChange: (filters: Partial<TaskFilter>) => void;
  showAdvanced?: boolean;
};

/**
 * TaskFilters Component
 *
 * @description Filter-UI für die Task-Liste
 */
export const TaskFilters = ({ filters, onFiltersChange, showAdvanced }: TaskFiltersProps) => {
  const activeFilterCount =
    (filters.status?.length ?? 0) +
    (filters.prioritaet?.length ?? 0) +
    (filters.contextType ? 1 : 0);

  const clearFilters = () => {
    onFiltersChange({
      status: undefined,
      prioritaet: undefined,
      contextType: undefined,
      contextId: undefined,
      kategorie: undefined,
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">Filter</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount} aktiv
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status
                {filters.status?.length ? (
                  <Badge variant="secondary" className="ml-2">
                    {filters.status.length}
                  </Badge>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Status filtern</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(TASK_STATUS_CONFIG).map(([value, config]) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={filters.status?.includes(value as (typeof filters.status)[number])}
                  onCheckedChange={checked => {
                    const currentStatus = filters.status ?? [];
                    const newStatus = checked
                      ? [...currentStatus, value]
                      : currentStatus.filter(s => s !== value);
                    onFiltersChange({
                      ...filters,
                      status: newStatus.length ? (newStatus as typeof filters.status) : undefined,
                    });
                  }}
                >
                  <span className="mr-2">{config.icon}</span>
                  {config.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priorität Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Priorität
                {filters.prioritaet?.length ? (
                  <Badge variant="secondary" className="ml-2">
                    {filters.prioritaet.length}
                  </Badge>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Priorität filtern</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(TASK_PRIORITY_CONFIG).map(([value, config]) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={filters.prioritaet?.includes(
                    value as (typeof filters.prioritaet)[number]
                  )}
                  onCheckedChange={checked => {
                    const currentPriority = filters.prioritaet ?? [];
                    const newPriority = checked
                      ? [...currentPriority, value]
                      : currentPriority.filter(p => p !== value);
                    onFiltersChange({
                      ...filters,
                      prioritaet: newPriority.length
                        ? (newPriority as typeof filters.prioritaet)
                        : undefined,
                    });
                  }}
                >
                  <span className="mr-2">{config.icon}</span>
                  {config.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Kontext Filter (nur für Admins) */}
          {showAdvanced ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Kontext
                  {filters.contextType ? (
                    <Badge variant="secondary" className="ml-2">
                      {TASK_CONTEXT_CONFIG[filters.contextType].label}
                    </Badge>
                  ) : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Kontext filtern</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(TASK_CONTEXT_CONFIG).map(([value, config]) => (
                  <DropdownMenuCheckboxItem
                    key={value}
                    checked={filters.contextType === value}
                    onCheckedChange={checked => {
                      onFiltersChange({
                        ...filters,
                        contextType: checked ? (value as typeof filters.contextType) : undefined,
                        contextId: undefined, // Reset contextId when changing type
                      });
                    }}
                  >
                    <span className="mr-2">{config.icon}</span>
                    {config.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Zurücksetzen
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
