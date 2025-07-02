/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// frontend/src/features/public/organization-structure/ui/Structure.tsx
import { useCallback, useMemo, useRef, useState } from 'react';

import {
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
  ReactFlow,
  type ReactFlowInstance,
} from '@xyflow/react';
import { Info } from 'lucide-react';

import type { OrganizationNode } from '@/entities/public/organization';

import { cn } from '@/shared/lib';
import { Badge, Button, Card } from '@/shared/shadcn';
import {
  CompactToolbar,
  exportChart,
  getLayoutedElements,
  type OrgChartNode,
  OrgNode,
  type OrgNodeData,
} from '@/shared/ui/charts';

import '@xyflow/react/dist/style.css';

type OrgChartProps = {
  data: OrganizationNode;
  className?: string;
};

const nodeTypes = {
  org: OrgNode,
};

/**
 * Konvertiert hierarchische Daten in React Flow Nodes und Edges
 */
const convertToFlowElements = (
  node: OrganizationNode,
  parentId: string | null = null,
  level = 0
): { nodes: OrgChartNode[]; edges: Edge[] } => {
  const nodes: OrgChartNode[] = [];
  const edges: Edge[] = [];

  const nodeId = `node-${String(node.name).replace(/\s+/g, '-').toLowerCase()}`;

  const getNodeType = (): 'board' | 'advisory' | 'audit' | 'team' => {
    const typeMap: Record<string, 'board' | 'advisory' | 'audit' | 'team'> = {
      board: 'board',
      advisory: 'advisory',
      audit: 'audit',
      team: 'team',
    };
    return typeMap[node.type] ?? 'team';
  };

  const baseData: OrgNodeData = {
    id: nodeId,
    label: node.name,
    department: node.description ?? node.name,
    level,
    type: getNodeType(),
    memberCount: node.members?.length,
  };

  const flowNode: OrgChartNode = {
    id: nodeId,
    type: 'org',
    position: { x: 0, y: level * 200 },
    data: baseData,
  };

  nodes.push(flowNode);

  if (parentId) {
    edges.push({
      id: `edge-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      type: 'smoothstep',
    });
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child: OrganizationNode) => {
      const childElements = convertToFlowElements(child, nodeId, level + 1);
      nodes.push(...childElements.nodes);
      edges.push(...childElements.edges);
    });
  }

  return { nodes, edges };
};

/**
 * OrgChart Component
 * @description Interaktives Organigramm zur Darstellung der Vereinsstruktur
 */
export const Structure = ({ data, className }: OrgChartProps) => {
  const [selectedNode, setSelectedNode] = useState<OrgNodeData | null>(null);
  const reactFlowInstanceRef = useRef<ReactFlowInstance<Node<OrgNodeData>> | null>(null);

  const flowElements = useMemo(() => {
    const { nodes, edges } = convertToFlowElements(data);
    return getLayoutedElements(nodes, edges, 'TB');
  }, [data]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as OrgNodeData);
  }, []);

  const handleExport = useCallback(async (format: 'png' | 'svg' | 'pdf') => {
    if (reactFlowInstanceRef.current) {
      await exportChart(
        reactFlowInstanceRef.current as unknown as ReactFlowInstance,
        format,
        'organigramm'
      );
    }
  }, []);

  const onInit = useCallback((instance: ReactFlowInstance<Node<OrgNodeData>>) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Info Card */}
      <Card className="border-0 bg-[var(--color-muted)] p-4">
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
          <Info className="h-4 w-4" />
          <p>
            Klicke auf ein Element für mehr Details • Scrolle zum Zoomen • Nutze die Toolbar zum
            Exportieren
          </p>
        </div>
      </Card>

      {/* Organigramm */}
      <Card className="overflow-hidden p-0">
        {/* Legend als Header */}
        <div className="border-b bg-[var(--color-muted)] px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-sm font-medium">Hierarchie-Übersicht</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-gradient-to-b from-blue-500 to-blue-600" />
                <span>Vorstand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-gradient-to-b from-red-500 to-red-600" />
                <span>Beirat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-gradient-to-b from-amber-500 to-amber-600" />
                <span>Prüfung</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-[var(--color-muted)]" />
                <span>Team</span>
              </div>
            </div>
          </div>
        </div>

        {/* React Flow Container */}
        <div className="relative h-[600px] bg-[var(--color-background)]">
          <ReactFlow<Node<OrgNodeData>>
            nodes={flowElements.nodes}
            edges={flowElements.edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-left"
            onInit={onInit}
            style={{
              background: 'transparent',
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="var(--color-border)"
              className="opacity-20"
            />
            <CompactToolbar onExport={handleExport} />
          </ReactFlow>
        </div>

        {/* Selected Node Details - als Footer */}
        {selectedNode ? (
          <div className="animate-in slide-in-from-bottom-2 border-t bg-[var(--color-muted)] p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-lg font-semibold">
                  {selectedNode.label}
                  <Badge variant="secondary" className="text-xs">
                    {selectedNode.type === 'board' && 'Vorstand'}
                    {selectedNode.type === 'advisory' && 'Beirat'}
                    {selectedNode.type === 'audit' && 'Prüfung'}
                    {selectedNode.type === 'team' && 'Team'}
                  </Badge>
                </h4>
                {selectedNode.department && selectedNode.department !== selectedNode.label ? (
                  <p className="text-muted-foreground text-sm">{selectedNode.department}</p>
                ) : null}
                <p className="text-muted-foreground text-sm">
                  Hierarchieebene: {selectedNode.level + 1}
                </p>
                {selectedNode.memberCount !== undefined && selectedNode.memberCount > 0 && (
                  <p className="text-muted-foreground text-sm">
                    {selectedNode.memberCount} Mitglieder
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedNode(null);
                }}
              >
                Schließen
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
};
