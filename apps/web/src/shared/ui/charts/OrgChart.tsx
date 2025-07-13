// frontend/src/shared/ui/charts/OrgChart.tsx
import { useState } from 'react';

import { ChevronDown, ChevronUp, Users } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Badge } from '@/shared/shadcn';

import type { OrgChartNode, OrgChartProps } from './types';

/**
 * OrgChart
 * @description Zeigt ein hierarchisches Organigramm ohne externe Abhängigkeiten
 * @param {OrgChartNode[]} nodes - Array von Organisationsknoten
 * @param {Function} onNodeClick - Callback bei Klick auf einen Knoten
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {boolean} expandable - Erlaubt das Ein-/Ausklappen von Ebenen
 * @example
 * ```tsx
 * <OrgChart
 *   nodes={[
 *     { id: '1', label: 'Vorstand', department: 'Führung', level: 0, type: 'board' },
 *     { id: '2', label: 'Team Event', department: 'Events', level: 1, type: 'team', parentId: '1' }
 *   ]}
 *   onNodeClick={(node) => console.log(node)}
 * />
 * ```
 */
export const OrgChart = ({ nodes, onNodeClick, className, expandable = false }: OrgChartProps) => {
  const [collapsedLevels, setCollapsedLevels] = useState<Set<number>>(new Set());

  const nodesByLevel = nodes.reduce<Record<number, OrgChartNode[]>>((acc, node) => {
    const { level } = node;
    acc[level] ??= [];
    acc[level].push(node);
    return acc;
  }, {});

  const getNodeStyles = (type: OrgChartNode['type']) => {
    const styles = {
      board: {
        gradient: 'from-blue-500 to-blue-600',
        shadow: 'shadow-blue-500/25',
        badge: 'bg-blue-100 text-blue-800',
      },
      advisory: {
        gradient: 'from-red-500 to-red-600',
        shadow: 'shadow-red-500/25',
        badge: 'bg-red-100 text-red-800',
      },
      team: {
        gradient: 'from-gray-400 to-gray-500',
        shadow: 'shadow-gray-400/25',
        badge: 'bg-gray-100 text-gray-800',
      },
    };
    return styles[type];
  };

  const toggleLevel = (level: number) => {
    const newCollapsed = new Set(collapsedLevels);
    if (newCollapsed.has(level)) {
      newCollapsed.delete(level);
    } else {
      newCollapsed.add(level);
    }
    setCollapsedLevels(newCollapsed);
  };

  const maxLevel = Math.max(...Object.keys(nodesByLevel).map(Number));

  return (
    <div className={cn('space-y-12', className)}>
      {Object.entries(nodesByLevel)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([level, levelNodes]) => {
          const numLevel = Number(level);
          const isCollapsed = collapsedLevels.has(numLevel);

          return (
            <div key={level} className="relative">
              {/* Level Header für expandable */}
              {expandable && numLevel < maxLevel ? (
                <button
                  onClick={() => {
                    toggleLevel(numLevel + 1);
                  }}
                  className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-sm"
                >
                  {collapsedLevels.has(numLevel + 1) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                  Ebene {numLevel + 2}{' '}
                  {collapsedLevels.has(numLevel + 1) ? 'anzeigen' : 'ausblenden'}
                </button>
              ) : null}

              {/* Nodes */}
              {!isCollapsed && (
                <div className="flex flex-wrap justify-center gap-6">
                  {levelNodes.map(node => {
                    const styles = getNodeStyles(node.type);

                    return (
                      <button
                        key={node.id}
                        onClick={() => onNodeClick?.(node)}
                        className={cn(
                          'group relative min-w-[220px] rounded-xl p-6 text-white',
                          'transform transition-all duration-200',
                          'hover:scale-105 hover:shadow-2xl',
                          'bg-gradient-to-br',
                          styles.gradient,
                          styles.shadow
                        )}
                      >
                        {/* Level Badge */}
                        <Badge className={cn('absolute -top-3 -right-3', styles.badge)}>
                          Level {node.level + 1}
                        </Badge>

                        {/* Content */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold">{node.label}</h3>
                          <p className="text-sm opacity-90">{node.department}</p>

                          {node.memberCount !== undefined && (
                            <div className="mt-3 flex items-center gap-1 border-t border-white/20 pt-3">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">{node.memberCount} Mitglieder</span>
                            </div>
                          )}
                        </div>

                        {/* Connection Line */}
                        {node.parentId && numLevel > 0 ? (
                          <div className="absolute -top-6 left-1/2 h-6 w-px -translate-x-1/2 bg-gray-300" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
