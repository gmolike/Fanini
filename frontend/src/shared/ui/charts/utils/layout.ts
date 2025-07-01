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
    nodesep: 100,
    ranksep: 120,
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
// Am Ende von shared/ui/charts/utils/layout.ts hinzufügen:

/**
 * Berechnet optimale Viewport-Einstellungen
 */
export const calculateViewport = (nodes: Node[]): { x: number; y: number; zoom: number } => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, zoom: 1 };
  }

  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;

  nodes.forEach(node => {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + 220);
    maxY = Math.max(maxY, node.position.y + 100);
  });

  const width = maxX - minX;
  const height = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const viewportWidth = window.innerWidth - 100;
  const viewportHeight = window.innerHeight - 100;

  const zoom = Math.min(viewportWidth / width, viewportHeight / height, 1);

  return {
    x: viewportWidth / 2 - centerX * zoom,
    y: viewportHeight / 2 - centerY * zoom,
    zoom,
  };
};
