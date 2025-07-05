// shared/ui/charts/model/useChartData.ts
import { useEffect, useState } from 'react';

import { type Edge, type Node } from '@xyflow/react';

import type { BaseNodeData, FlowUpdate } from '../types';

type ChartDataConfig<T extends Record<string, unknown>> = {
  fetchData?: () => Promise<{ nodes: Node<T>[]; edges: Edge[] }>;
  realtimeUrl?: string;
  onDataChange?: (data: { nodes: Node<T>[]; edges: Edge[] }) => void;
};

/**
 * Hook für Chart-Daten-Management mit optionaler Echtzeit-Synchronisation
 */
export const useChartData = <T extends BaseNodeData>({
  fetchData,
  realtimeUrl,
  onDataChange,
}: ChartDataConfig<T>) => {
  const [nodes, setNodes] = useState<Node<T>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initial data fetch
  useEffect(() => {
    if (!fetchData) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchData();
        setNodes(data.nodes);
        setEdges(data.edges);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [fetchData]);

  // Realtime updates
  useEffect(() => {
    if (!realtimeUrl) return;

    const ws = new WebSocket(realtimeUrl);

    ws.onmessage = (event: MessageEvent) => {
      try {
        const update = JSON.parse(event.data as string) as FlowUpdate;

        switch (update.type) {
          case 'nodes:update':
            setNodes(update.payload as Node<T>[]);
            break;
          case 'edges:update':
            setEdges(update.payload);
            break;
          case 'full:update':
            setNodes(update.payload.nodes as Node<T>[]);
            setEdges(update.payload.edges);
            break;
        }

        onDataChange?.({ nodes, edges });
      } catch (err) {
        console.error('Failed to parse websocket message:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [realtimeUrl, onDataChange, nodes, edges]);

  return {
    nodes,
    edges,
    isLoading,
    error,
    setNodes,
    setEdges,
  };
};
