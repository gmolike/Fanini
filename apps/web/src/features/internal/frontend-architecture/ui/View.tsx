/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/naming-convention */
import { motion } from 'framer-motion';
import { FileCode, Folder, Package } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Badge } from '@/shared/shadcn';
import { GlassCard } from '@/shared/ui';

type ArchitectureLayer = {
  name: string;
  description: string;
  color: string;
  entities: {
    name: string;
    status: 'complete' | 'in-progress' | 'planned';
    type: 'public' | 'internal' | 'shared';
  }[];
};

const frontendLayers: ArchitectureLayer[] = [
  {
    name: 'Pages',
    description: 'Routing und Seitenstruktur',
    color: 'from-blue-500 to-blue-600',
    entities: [
      { name: 'Home', status: 'complete', type: 'public' },
      { name: 'Events', status: 'complete', type: 'public' },
      { name: 'About', status: 'complete', type: 'public' },
      { name: 'Dashboard', status: 'in-progress', type: 'internal' },
      { name: 'Member Management', status: 'planned', type: 'internal' },
    ],
  },
  {
    name: 'Widgets',
    description: 'Zusammengesetzte UI-Blöcke',
    color: 'from-purple-500 to-purple-600',
    entities: [
      { name: 'HomeWidget', status: 'complete', type: 'public' },
      { name: 'EventWidget', status: 'complete', type: 'public' },
      { name: 'DashboardWidget', status: 'in-progress', type: 'internal' },
      { name: 'TaskWidget', status: 'planned', type: 'internal' },
    ],
  },
  {
    name: 'Features',
    description: 'Business Logic und Use Cases',
    color: 'from-green-500 to-green-600',
    entities: [
      { name: 'EventList', status: 'complete', type: 'public' },
      { name: 'EventDetail', status: 'complete', type: 'public' },
      { name: 'TaskManagement', status: 'in-progress', type: 'internal' },
      { name: 'MemberProfile', status: 'planned', type: 'internal' },
    ],
  },
  {
    name: 'Entities',
    description: 'Domain Models und API',
    color: 'from-orange-500 to-orange-600',
    entities: [
      { name: 'Event', status: 'complete', type: 'shared' },
      { name: 'Member', status: 'complete', type: 'shared' },
      { name: 'Task', status: 'in-progress', type: 'internal' },
      { name: 'Document', status: 'complete', type: 'shared' },
    ],
  },
  {
    name: 'Shared',
    description: 'UI Components und Utilities',
    color: 'from-pink-500 to-pink-600',
    entities: [
      { name: 'UI Components', status: 'complete', type: 'shared' },
      { name: 'Hooks', status: 'complete', type: 'shared' },
      { name: 'Utils', status: 'complete', type: 'shared' },
      { name: 'Config', status: 'complete', type: 'shared' },
    ],
  },
];

/**
 * FrontendArchitectureView
 * @description Visualisierung der FSD Frontend-Architektur
 */
export const FrontendArchitectureView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">Frontend Architektur (FSD)</h2>
        <p className="text-[var(--color-muted-foreground)]">
          Feature-Sliced Design mit klarer Trennung zwischen Public und Internal
        </p>
      </div>

      {frontendLayers.map((layer, index) => (
        <motion.div
          key={layer.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <div className={`rounded-lg bg-gradient-to-r p-2 ${layer.color}`}>
                    <Folder className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{layer.name}</h3>
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)]">{layer.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                <span className="text-sm font-medium">{layer.entities.length}</span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {layer.entities.map(entity => (
                <div
                  key={entity.name}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3',
                    entity.status === 'complete' && 'border-green-500/20 bg-green-500/10',
                    entity.status === 'in-progress' && 'border-yellow-500/20 bg-yellow-500/10',
                    entity.status === 'planned' && 'border-gray-500/20 bg-gray-500/10'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                    <span className="text-sm font-medium">{entity.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      let badgeVariant: 'default' | 'secondary' | 'outline';
                      if (entity.type === 'public') {
                        badgeVariant = 'default';
                      } else if (entity.type === 'internal') {
                        badgeVariant = 'secondary';
                      } else {
                        badgeVariant = 'outline';
                      }
                      return (
                        <Badge variant={badgeVariant}>
                          {entity.type}
                        </Badge>
                      );
                    })()}
                    <StatusDot status={entity.status} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

type StatusDotProps = {
  status: 'complete' | 'in-progress' | 'planned';
};

const StatusDot = ({ status }: StatusDotProps) => {
  const colors = {
    complete: 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    planned: 'bg-gray-400',
  } as const;

  return <div className={cn('h-2 w-2 rounded-full', colors[status])} />;
};
