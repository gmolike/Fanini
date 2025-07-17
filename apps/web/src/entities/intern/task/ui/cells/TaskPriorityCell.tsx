// entities/intern/task/ui/cells/TaskPriorityCell.tsx
import { cn } from '@/shared/lib';
import { Badge } from '@/shared/shadcn/badge';
import type { CellProps } from '@/shared/ui/dataTable';

import { TASK_PRIORITY_CONFIG, type TaskListItem, type TaskPriority } from '../../model/types';

/**
 * TaskPriorityCell Component
 *
 * @description Zeigt die Task-Priorität als farbiges Badge an
 */
export const TaskPriorityCell = ({ value }: CellProps<TaskListItem>) => {
  const priority = value as TaskPriority;
  const config = TASK_PRIORITY_CONFIG[priority];

  return (
    <Badge variant="outline" className={cn(config.color, 'font-normal')}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};
