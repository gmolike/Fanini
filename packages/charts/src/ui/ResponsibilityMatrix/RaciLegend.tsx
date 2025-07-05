// shared/ui/charts/ui/ResponsibilityMatrix/RaciLegend.tsx
import { memo } from 'react';

import { cn } from '@/shared/lib';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn';

import type { RACIRole } from '../../types';

/**
 * RACI-Legende Komponente
 */
export const RACILegend = memo(() => {
  const roles: RACIRole[] = ['Responsible', 'Accountable', 'Consulted', 'Informed'];

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

  return (
    <Card className="w-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">RACI-Legende</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {roles.map(role => {
          const config = getRoleConfig(role);
          return (
            <div key={role} className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn('h-6 min-w-[24px] justify-center text-xs font-bold', config.color)}
              >
                {config.short}
              </Badge>
              <span className="text-sm">{config.description}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
});

RACILegend.displayName = 'RACILegend';
