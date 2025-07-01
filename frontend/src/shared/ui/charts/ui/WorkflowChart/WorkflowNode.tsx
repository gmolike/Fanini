// shared/ui/charts/ui/WorkflowChart/WorkflowNode.tsx
import { memo, useState } from 'react';

import { Handle, type NodeProps, Position } from '@xyflow/react';
import {
  CheckCircle2,
  CheckSquare,
  Flag,
  GitBranch,
  Loader2,
  MessageSquare,
  Play,
  XCircle,
} from 'lucide-react';

import { cn } from '@/shared/lib';
import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from '@/shared/shadcn';

import type { ChecklistItem, WorkflowNodeData } from '../../types';

/**
 * Workflow-Knoten mit Status, Checklisten und Kommentaren
 */
export const WorkflowNode = memo<NodeProps>(({ data, selected = false }) => {
  const [showChecklist, setShowChecklist] = useState(false);

  // Explizite Typisierung
  const nodeData = data as WorkflowNodeData;

  const getNodeConfig = () => {
    const configs = {
      start: {
        icon: Play,
        shape: 'rounded-full',
        color: 'bg-green-100 border-green-300 text-green-800',
      },
      process: {
        icon: Loader2,
        shape: 'rounded-lg',
        color: 'bg-blue-100 border-blue-300 text-blue-800',
      },
      decision: {
        icon: GitBranch,
        shape: 'rounded-lg rotate-45',
        color: 'bg-purple-100 border-purple-300 text-purple-800',
      },
      end: {
        icon: Flag,
        shape: 'rounded-full',
        color: 'bg-gray-100 border-gray-300 text-gray-800',
      },
    };
    return configs[nodeData.type];
  };

  const getStatusIcon = () => {
    const icons = {
      pending: null,

       
      'in-progress': <Loader2 className="h-4 w-4 animate-spin" />,
      completed: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      blocked: <XCircle className="h-4 w-4 text-red-600" />,
    };
    return icons[nodeData.status];
  };

  const config = getNodeConfig();
  const Icon = config.icon;
  const StatusIcon = getStatusIcon();

  const completedChecklist = nodeData.checklist?.filter(item => item.completed).length ?? 0;
  const totalChecklist = nodeData.checklist?.length ?? 0;

  return (
    <div
      className={cn(
        'relative border-2 p-4 shadow-md',
        'min-w-[200px] transition-all duration-200',
        config.shape,
        config.color,
        selected && 'border-primary scale-105 shadow-lg',
        nodeData.type === 'decision' && 'transform-gpu'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={cn('h-3 w-3', nodeData.type === 'decision' && '-rotate-45')}
      />

      <div className={cn('space-y-2', nodeData.type === 'decision' && '-rotate-45')}>
        <div className="flex items-start justify-between">
          <Icon className="h-5 w-5" />
          {StatusIcon}
        </div>

        <div>
          <h3 className="font-semibold">{nodeData.label}</h3>
          {nodeData.assignee ? <p className="text-sm opacity-75">→ {nodeData.assignee}</p> : null}
        </div>

        <div className="mt-2 flex gap-2">
          {nodeData.checklist && nodeData.checklist.length > 0 ? (
            <Popover open={showChecklist} onOpenChange={setShowChecklist}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <CheckSquare className="mr-1 h-3 w-3" />
                  {completedChecklist}/{totalChecklist}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <ChecklistPanel items={nodeData.checklist} />
              </PopoverContent>
            </Popover>
          ) : null}

          {nodeData.comments && nodeData.comments.length > 0 ? (
            <Badge variant="secondary" className="text-xs">
              <MessageSquare className="mr-1 h-3 w-3" />
              {nodeData.comments.length}
            </Badge>
          ) : null}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn('h-3 w-3', nodeData.type === 'decision' && '-rotate-45')}
      />
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';

/**
 * Checklisten-Panel für Workflow-Knoten
 */
const ChecklistPanel = memo<{ items: readonly ChecklistItem[] }>(({ items }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">Checkliste</h4>
      {items.map(item => (
        <div key={item.id} className="flex items-start gap-2">
          <input type="checkbox" checked={item.completed} readOnly className="mt-0.5" />
          <div className="flex-1">
            <p className="text-sm">{item.label}</p>
            {item.assignee ? (
              <p className="text-muted-foreground text-xs">→ {item.assignee}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
});

ChecklistPanel.displayName = 'ChecklistPanel';
