// frontend/src/widgets/public/organization/structure/Chart.tsx
import { useCallback, useMemo, useRef, useState } from 'react';

import {
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
  ReactFlow,
  type ReactFlowInstance,
} from '@xyflow/react';

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

type ChartProps = {
  data: OrganizationNode;
  className?: string;
};

// Node Types für React Flow
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

  // Typsichere Konvertierung
  const orgNode = node as {
    name?: unknown;
    description?: unknown;
    type?: unknown;
    members?: unknown;
    children?: unknown;
  };

  // Node-ID generieren - sicherer Zugriff
  const nodeName = typeof orgNode.name === 'string' ? orgNode.name : 'unnamed';
  const nodeId = `node-${nodeName.replace(/\s+/g, '-').toLowerCase()}`;

  // Type Mapping - prüfe welche Werte tatsächlich kommen
  const getNodeType = (): 'board' | 'advisory' | 'audit' | 'team' => {
    const typeValue = String(orgNode.type).toLowerCase();

    // Mapping verschiedener möglicher Werte
    if (typeValue.includes('vorstand') || typeValue === 'board') return 'board';
    if (typeValue.includes('beirat') || typeValue === 'advisory') return 'advisory';
    if (typeValue.includes('kassenprüf') || typeValue.includes('prüf') || typeValue === 'audit')
      return 'audit';

    return 'team';
  };

  // Node erstellen
  const baseData = {
    id: nodeId,
    label: nodeName,
    department: typeof orgNode.description === 'string' ? orgNode.description : nodeName,
    level,
    type: getNodeType(),
  };

  const memberCount =
    Array.isArray(orgNode.members) && orgNode.members.length > 0
      ? orgNode.members.length
      : undefined;

  const flowNode: OrgChartNode = {
    id: nodeId,
    type: 'org',
    position: { x: 0, y: level * 200 }, // Mehr vertikaler Abstand
    data: memberCount !== undefined ? { ...baseData, memberCount } : baseData,
  };

  nodes.push(flowNode);

  // Edge zum Parent erstellen
  if (parentId) {
    edges.push({
      id: `edge-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      type: 'smoothstep',
    });
  }

  // Rekursiv Children verarbeiten
  if (Boolean(orgNode.children) && Array.isArray(orgNode.children)) {
    orgNode.children.forEach((child: OrganizationNode) => {
      const childElements = convertToFlowElements(child, nodeId, level + 1);
      nodes.push(...childElements.nodes);
      edges.push(...childElements.edges);
    });
  }

  return { nodes, edges };
};

/**
 * Interaktives Organigramm zur Darstellung der Vereinsstruktur
 */
export const Chart = ({ data, className }: ChartProps) => {
  const [selectedNode, setSelectedNode] = useState<OrgNodeData | null>(null);
  const reactFlowInstanceRef = useRef<ReactFlowInstance<Node<OrgNodeData>> | null>(null);

  // Konvertiere Daten zu React Flow Format
  const flowElements = useMemo(() => {
    const { nodes, edges } = convertToFlowElements(data);
    // Automatisches Layout anwenden
    return getLayoutedElements(nodes, edges, 'TB');
  }, [data]);

  // Node Click Handler
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as OrgNodeData);
  }, []);

  // Export Handler
  const handleExport = useCallback(async (format: 'png' | 'svg' | 'pdf') => {
    if (reactFlowInstanceRef.current) {
      await exportChart(
        reactFlowInstanceRef.current as unknown as ReactFlowInstance,
        format,
        'organigramm'
      );
    }
  }, []);

  // React Flow Init Handler
  const onInit = useCallback((instance: ReactFlowInstance<Node<OrgNodeData>>) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="space-y-4 p-6">
        {/* Legend */}
        <div className="flex items-center justify-between">
          <h3 className="text-muted-foreground text-sm">
            Klicke auf ein Element für mehr Details • Scrolle zum Zoomen
          </h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gradient-to-b from-blue-500 to-blue-600" />
              <span>Vorstand</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gradient-to-b from-red-500 to-red-600" />
              <span>Beirat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gradient-to-b from-amber-500 to-amber-600" />
              <span>Prüfung</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-muted h-4 w-4 rounded" />
              <span>Team</span>
            </div>
          </div>
        </div>

        {/* React Flow Container */}
        <div className="bg-muted relative h-[500px] rounded-lg">
          <ReactFlow<Node<OrgNodeData>>
            nodes={flowElements.nodes}
            edges={flowElements.edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-left"
            onInit={onInit}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              color="var(--color-border)"
              className="opacity-50"
            />
            <CompactToolbar onExport={handleExport} />
          </ReactFlow>
        </div>

        {/* Selected Node Details */}
        {selectedNode ? (
          <div className="animate-in slide-in-from-bottom-2 bg-muted rounded-lg p-4">
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
      </div>
    </Card>
  );
};
