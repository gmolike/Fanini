// shared/ui/charts/utils/layout.ts
import { type Edge, type Node } from '@xyflow/react';
import dagre from 'dagre';

type LayoutDirection = 'TB' | 'BT' | 'LR' | 'RL';

/**
 * Automatisches Layout für hierarchische Diagramme
 */
export const getLayoutedElements = <T extends Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[],
  direction: LayoutDirection = 'TB'
): { nodes: Node<T>[]; edges: Edge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 220;
  const nodeHeight = 100;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 80,
    marginx: 20,
    marginy: 20,
  });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
