// shared/ui/charts/ui/ResponsibilityMatrix/RaciNode.tsx
import { memo } from 'react';

import { type NodeProps } from '@xyflow/react';

import { cn } from '@/shared/lib';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn';

import type { RACINodeData, RACIRole } from '../../types';

/**
 * RACI-Matrix Knoten zur Darstellung von Verantwortlichkeiten
 */
export const RACINode = memo<NodeProps>(({ data, selected = false }) => {
  // Explizite Typisierung
  const nodeData = data as RACINodeData;

  const getRoleConfig = (role: RACIRole) => {
    const configs = {
      Responsible: {
        short: 'R',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Durchführungsverantwortlich',
      },
      Accountable: {
        short: 'A',
        color: 'bg-green-100 text-green-800 border-green-200',
        description: 'Ergebnisverantwortlich',
      },
      Consulted: {
        short: 'C',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        description: 'Beratend',
      },
      Informed: {
        short: 'I',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        description: 'Zu informieren',
      },
    };
    return configs[role];
  };

  const sortedAssignments = Array.from(nodeData.assignments.entries()).sort(([, a], [, b]) => {
    const order: RACIRole[] = ['Accountable', 'Responsible', 'Consulted', 'Informed'];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <Card
      className={cn(
        'min-w-[320px] transition-all duration-200',
        selected && 'ring-primary shadow-lg ring-2'
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{nodeData.taskName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedAssignments.map(([person, role]) => {
          const config = getRoleConfig(role);
          return (
            <div key={person} className="flex items-center justify-between gap-4">
              <span className="flex-1 truncate text-sm">{person}</span>
              <Badge
                variant="outline"
                className={cn('h-7 min-w-[32px] justify-center font-bold', config.color)}
                title={config.description}
              >
                {config.short}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
});

RACINode.displayName = 'RACINode';

// Export der RACILegend aus separater Datei
export { RACILegend } from './RaciLegend';
