// entities/intern/task/ui/cells/TaskTitleCell.tsx
import { Badge } from '@/shared/shadcn';
import { Checkbox } from '@/shared/shadcn/checkbox';
import type { CellProps } from '@/shared/ui/dataTable';

import type { TaskListItem } from '../../model/types';

/**
 * TaskTitleCell Component
 *
 * @description Zeigt den Titel mit Checkbox für erledigte Tasks
 */
export const TaskTitleCell = ({ row }: CellProps<TaskListItem>) => {
  const isCompleted = row.status === 'erledigt';

  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={isCompleted} disabled />
      <span className={isCompleted ? 'text-muted-foreground line-through' : ''}>{row.titel}</span>
      {row.istStandardaufgabe ? <Badge variant="outline" className="text-xs">
          Vorlage
        </Badge> : null}
    </div>
  );
};
