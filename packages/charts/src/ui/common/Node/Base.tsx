// shared/ui/charts/ui/common/Node/Base.tsx
import { memo } from 'react';

import { Handle, type NodeProps, Position } from '@xyflow/react';

import { cn } from '@/shared/lib';

import type { BaseNodeData } from '../../../types';

/**
 * Basis-Knoten-Komponente für konsistentes Styling
 */
export const BaseNode = memo<NodeProps>(({ data, selected = false, dragging = false }) => {
  // Explizite Typisierung der data
  const nodeData = data as BaseNodeData;

  return (
    <button
      type="button"
      className={cn(
        'bg-background rounded-lg border-2 px-4 py-3 shadow-md',
        'min-w-[180px] transition-all duration-200',
        selected && 'border-primary scale-105 shadow-lg',
        !selected && 'border-border hover:border-muted-foreground',
        dragging && 'cursor-grabbing opacity-50'
      )}
      aria-label={`Node: ${nodeData.label}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary h-3 w-3"
        aria-label="Connect from"
      />

      <div className="text-foreground font-semibold">{nodeData.label}</div>
      {nodeData.description ? (
        <div className="text-muted-foreground text-sm">{nodeData.description}</div>
      ) : null}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary h-3 w-3"
        aria-label="Connect to"
      />
    </button>
  );
});

BaseNode.displayName = 'BaseNode';
