// shared/ui/charts/model/useChartInteraction.ts
import { useCallback, useRef } from 'react';

import { type Edge, type Node, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';

import type { BaseNodeData } from '../types';

/**
 * Hook für Chart-Interaktionen mit Undo/Redo Support
 */
export const useChartInteraction = <T extends BaseNodeData>() => {
  const [nodes, setNodes, onNodesChange] = useNodesState<T>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const historyRef = useRef<{
    past: { nodes: Node<T>[]; edges: Edge[] }[];
    future: { nodes: Node<T>[]; edges: Edge[] }[];
  }>({
    past: [],
    future: [],
  });

  const saveToHistory = useCallback(() => {
    historyRef.current.past.push({
      nodes: [...nodes],
      edges: [...edges],
    });
    historyRef.current.future = [];
  }, [nodes, edges]);

  const undo = useCallback(() => {
    const history = historyRef.current;
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    if (!previous) return;

    history.past.pop();
    history.future.push({
      nodes: [...nodes],
      edges: [...edges],
    });

    setNodes(previous.nodes);
    setEdges(previous.edges);
  }, [nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    const history = historyRef.current;
    if (history.future.length === 0) return;

    const next = history.future[history.future.length - 1];
    if (!next) return;

    history.future.pop();
    history.past.push({
      nodes: [...nodes],
      edges: [...edges],
    });

    setNodes(next.nodes);
    setEdges(next.edges);
  }, [nodes, edges, setNodes, setEdges]);

  const addNode = useCallback(
    (nodeData: T, position?: { x: number; y: number }) => {
      saveToHistory();

      const id = `node-${Date.now().toString()}`;
      const newNode: Node<T> = {
        id,
        type: 'default',
        data: nodeData,
        position:
          position ??
          screenToFlowPosition({
            x: window.innerWidth / 2,
            y: 100,
          }),
      };

      setNodes(nds => [...nds, newNode]);
    },
    [screenToFlowPosition, saveToHistory, setNodes]
  );

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<T>) => {
      saveToHistory();

      setNodes(nds =>
        nds.map(node =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...updates } } : node
        )
      );
    },
    [saveToHistory, setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      saveToHistory();

      setNodes((nds: Node<T>[]) => nds.filter(node => node.id !== nodeId));
      setEdges((eds: Edge[]) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    },
    [saveToHistory, setNodes, setEdges]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    updateNode,
    deleteNode,
    undo,
    redo,
    canUndo: historyRef.current.past.length > 0,
    canRedo: historyRef.current.future.length > 0,
  };
};
