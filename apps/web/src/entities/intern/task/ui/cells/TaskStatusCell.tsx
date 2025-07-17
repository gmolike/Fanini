// entities/intern/task/ui/cells/TaskStatusCell.tsx
import { cn } from '@/shared/lib';
import { Badge } from '@/shared/shadcn/badge';
import type { CellProps } from '@/shared/ui/dataTable';

import { TASK_STATUS_CONFIG, type TaskListItem, type TaskStatus } from '../../model/types';

/**
 * TaskStatusCell Component
 *
 * @description Zeigt den Task-Status als farbiges Badge an
 */
export const TaskStatusCell = ({ value }: CellProps<TaskListItem>) => {
  const status = value as TaskStatus;
  const config = TASK_STATUS_CONFIG[status];

  return (
    <Badge className={cn(config.color, 'font-normal')}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};
