// entities/intern/task/ui/cells/TaskContextCell.tsx
import { Badge } from '@/shared/shadcn/badge';
import type { CellProps } from '@/shared/ui/dataTable';

import { TASK_CONTEXT_CONFIG, type TaskListItem } from '../../model/types';

/**
 * TaskContextCell Component
 *
 * @description Zeigt den Kontext-Typ der Aufgabe an
 */
export const TaskContextCell = ({ row }: CellProps<TaskListItem>) => {
  const config = TASK_CONTEXT_CONFIG[row.contextType as keyof typeof TASK_CONTEXT_CONFIG];

  return (
    <Badge variant="secondary">
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};
