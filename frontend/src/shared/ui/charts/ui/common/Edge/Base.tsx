// shared/ui/charts/ui/common/Edge/Base.tsx
import { memo } from 'react';

import {
  BaseEdge as XyflowBaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
} from '@xyflow/react';

import { cn } from '@/shared/lib';

/**
 * Basis-Kanten-Komponente mit optionalem Label
 */
export const BaseEdge = memo<EdgeProps>(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
    selected = false,
  }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <XyflowBaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd ?? ''}
          className={cn('stroke-2', selected ? 'stroke-primary' : 'stroke-muted-foreground')}
        />
        {data?.['label'] !== undefined ? (
          <EdgeLabelRenderer>
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${String(labelX)}px,${String(labelY)}px)`,
              }}
              className={cn(
                'bg-background rounded px-2 py-1 text-xs',
                'border-border border shadow-sm',
                'pointer-events-all'
              )}
            >
              {String(data['label'])}
            </div>
          </EdgeLabelRenderer>
        ) : null}
      </>
    );
  }
);

BaseEdge.displayName = 'BaseEdge';
