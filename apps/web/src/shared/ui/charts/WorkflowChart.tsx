// frontend/src/shared/ui/charts/WorkflowChart.tsx
import { AlertCircle, CheckCircle2, Circle, Clock } from 'lucide-react';

import { cn } from '@/shared/lib';

import type { WorkflowChartProps, WorkflowStep } from './types';

/**
 * WorkflowChart
 * @description Zeigt einen Workflow als vertikale oder horizontale Timeline
 * @param {WorkflowStep[]} steps - Array von Workflow-Schritten
 * @param {Function} onStepClick - Callback bei Klick auf einen Schritt
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {'vertical' | 'horizontal'} orientation - Ausrichtung der Timeline
 * @example
 * ```tsx
 * <WorkflowChart
 *   steps={[
 *     { id: '1', label: 'Event erstellen', status: 'completed' },
 *     { id: '2', label: 'Genehmigung', status: 'active', assignee: 'Max Mustermann' },
 *     { id: '3', label: 'Veröffentlichen', status: 'pending' }
 *   ]}
 *   onStepClick={(step) => console.log(step)}
 * />
 * ```
 */
export const WorkflowChart = ({
  steps,
  onStepClick,
  className,
  orientation = 'vertical',
}: WorkflowChartProps) => {
  type StatusConfig = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    bgColor: string;
    borderColor: string;
    pulse?: boolean;
  };

  const getStatusConfig = (status: WorkflowStep['status']): StatusConfig => {
    const configs: Record<WorkflowStep['status'], StatusConfig> = {
      completed: {
        icon: CheckCircle2,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      },
      active: {
        icon: Clock,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        pulse: true,
      },
      pending: {
        icon: Circle,
        color: 'text-gray-400',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      },
      error: {
        icon: AlertCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      },
    };
    return configs[status];
  };

  const isVertical = orientation === 'vertical';

  return (
    <div
      className={cn(
        'relative',
        isVertical ? 'space-y-8' : 'flex space-x-8 overflow-x-auto',
        className
      )}
    >
      {/* Connection Line */}
      <div
        className={cn(
          'absolute bg-gray-300',
          isVertical ? 'top-0 bottom-0 left-6 w-0.5' : 'top-6 right-0 left-0 h-0.5'
        )}
      />

      {/* Steps */}
      {steps.map((step, index) => {
        const config = getStatusConfig(step.status);
        const Icon = config.icon;
        return (
          <button
            key={step.id}
            onClick={() => onStepClick?.(step)}
            className={cn(
              'group relative text-left',
              isVertical ? 'flex w-full items-start gap-4' : 'flex-shrink-0'
            )}
          >
            {/* Icon Container */}
            <div
              className={cn(
                'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white transition-all',
                config.borderColor,
                'group-hover:scale-110',
                (Boolean(config.pulse)) && 'animate-pulse'
              )}
            >
              <Icon className={cn('h-6 w-6', config.color)} />
            </div>

            {/* Content */}
            <div
              className={cn(
                'flex-1 rounded-lg border p-4 transition-all',
                config.borderColor,
                config.bgColor,
                'group-hover:shadow-md',
                !isVertical && 'mt-4 ml-0 min-w-[200px]'
              )}
            >
              <h4 className={cn('font-semibold', step.status === 'completed' && 'text-gray-500')}>
                {step.label}
              </h4>

              {step.description ? (
                <p className="text-muted-foreground mt-1 text-sm">{step.description}</p>
              ) : null}

              <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                {step.assignee ? <span>→ {step.assignee}</span> : null}
                {step.dueDate ? <span>📅 {step.dueDate}</span> : null}
              </div>
            </div>

            {/* Step Number */}
            <div
              className={cn(
                'absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                config.bgColor,
                config.color
              )}
            >
              {index + 1}
            </div>
          </button>
        );
      })}
    </div>
  );
};
