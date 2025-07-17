// entities/intern/task/ui/cells/TaskAssigneesCell.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadcn/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/shadcn/tooltip';
import type { CellProps } from '@/shared/ui/dataTable';

import type { TaskListItem } from '../../model/types';

/**
 * TaskAssigneesCell Component
 *
 * @description Zeigt zugewiesene Personen als Avatar-Gruppe an
 */
export const TaskAssigneesCell = ({ row }: CellProps<TaskListItem>) => {
  const assignees = row.zugewiesenePersonen ?? [];

  if (assignees.length === 0) {
    return <span className="text-muted-foreground text-sm">Nicht zugewiesen</span>;
  }

  const displayCount = 3;
  const remaining = assignees.length - displayCount;

  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {assignees.slice(0, displayCount).map(person => (
          <Tooltip key={person.id}>
            <TooltipTrigger asChild>
              <Avatar className="border-background h-8 w-8 border-2">
                <AvatarImage src={person.profilbild} alt={person.name} />
                <AvatarFallback className="text-xs">
                  {person.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{person.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {remaining > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="border-background bg-muted flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium">
                +{remaining}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {remaining} weitere Person{remaining > 1 ? 'en' : ''}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
