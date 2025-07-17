// widgets/intern/task/list/ui/TaskCardView.tsx
import { Calendar, MoreVertical, Users } from 'lucide-react';

import {
  TASK_PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
  type TaskListItem,
} from '@/entities/intern/task';

import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn/dropdown-menu';
import { DateDisplay } from '@/shared/ui/display';

type TaskCardViewProps = {
  tasks: TaskListItem[];
  onEdit?: (task: TaskListItem) => void;
  onDelete?: (task: TaskListItem) => void;
  onView?: (task: TaskListItem) => void;
};

/**
 * TaskCardView Component
 *
 * @description Kartenansicht für Tasks
 */
export const TaskCardView = ({ tasks, onEdit, onDelete, onView }: TaskCardViewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map(task => (
        <Card
          key={task.id}
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => onView?.(task)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="line-clamp-2 text-base">{task.titel}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView?.(task)}>Anzeigen</DropdownMenuItem>
                  {onEdit ? (
                    <DropdownMenuItem
                      onClick={() => {
                        onEdit(task);
                      }}
                    >
                      Bearbeiten
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  {onDelete ? (
                    <DropdownMenuItem
                      onClick={() => {
                        onDelete(task);
                      }}
                      className="text-destructive"
                    >
                      Löschen
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Status & Priorität */}
            <div className="flex items-center gap-2">
              <Badge className={TASK_STATUS_CONFIG[task.status].color}>
                <span className="mr-1">{TASK_STATUS_CONFIG[task.status].icon}</span>
                {TASK_STATUS_CONFIG[task.status].label}
              </Badge>
              <Badge variant="outline" className={TASK_PRIORITY_CONFIG[task.prioritaet].color}>
                <span className="mr-1">{TASK_PRIORITY_CONFIG[task.prioritaet].icon}</span>
                {TASK_PRIORITY_CONFIG[task.prioritaet].label}
              </Badge>
            </div>

            {/* Zugewiesene Personen */}
            {task.zugewiesenePersonen && task.zugewiesenePersonen.length > 0 ? (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{task.zugewiesenePersonen.length} Personen zugewiesen</span>
              </div>
            ) : null}

            {/* Fälligkeitsdatum */}
            {task.frist ? (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <DateDisplay date={task.frist} format="short" />
              </div>
            ) : null}

            {/* Kategorie */}
            {task.kategorie ? (
              <Badge variant="secondary" className="text-xs">
                {task.kategorie}
              </Badge>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
