// shared/ui/charts/types.ts
import type { Edge, Node } from "@xyflow/react";

// packages/charts/src/types.ts
export type ChartDependencies = {
  cn: (...inputs: Array<string | undefined>) => string;
  components: {
    Badge: React.ComponentType<any>;
    Card: React.ComponentType<any>;
    CardContent: React.ComponentType<any>;
    CardHeader: React.ComponentType<any>;
    CardTitle: React.ComponentType<any>;
  };
};

/**
 * Basis-Datentyp für alle Chart-Knoten
 */
export type BaseNodeData = {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly metadata?: Record<string, unknown>;
};

/**
 * Datentyp für Organigramm-Knoten
 */
export type OrgNodeData = BaseNodeData & {
  readonly department: string;
  readonly level: number;
  readonly memberCount?: number;
  readonly type: "board" | "advisory" | "audit" | "team";
};

/**
 * Datentyp für Workflow-Knoten
 */
export type WorkflowNodeData = BaseNodeData & {
  readonly status: "pending" | "in-progress" | "completed" | "blocked";
  readonly type: "start" | "process" | "decision" | "end";
  readonly assignee?: string;
  readonly dueDate?: string;
  readonly checklist?: readonly ChecklistItem[];
  readonly comments?: readonly Comment[];
};

/**
 * Checklisten-Element
 */
export type ChecklistItem = {
  readonly id: string;
  readonly label: string;
  readonly completed: boolean;
  readonly assignee?: string;
  readonly dueDate?: string;
};

/**
 * Kommentar-Typ
 */
export type Comment = {
  readonly id: string;
  readonly author: string;
  readonly content: string;
  readonly timestamp: string;
  readonly resolved?: boolean;
};

/**
 * RACI-Matrix Knoten
 */
export type RACINodeData = BaseNodeData & {
  readonly taskId: string;
  readonly taskName: string;
  readonly assignments: ReadonlyMap<string, RACIRole>;
};

export type RACIRole = "Responsible" | "Accountable" | "Consulted" | "Informed";

/**
 * Chart-Konfiguration
 */
export type ChartConfig = {
  readonly orientation?: "horizontal" | "vertical";
  readonly nodeSpacing?: { x: number; y: number };
  readonly enableMinimap?: boolean;
  readonly enableControls?: boolean;
  readonly enableExport?: boolean;
  readonly enableRealtime?: boolean;
  readonly theme?: "light" | "dark" | "auto";
};

/**
 * Typen für React Flow Nodes
 */
export type OrgChartNode = Node<OrgNodeData>;
export type WorkflowChartNode = Node<WorkflowNodeData>;
export type RACIChartNode = Node<RACINodeData>;

/**
 * Update Event Types für Websocket
 */
export type FlowUpdate =
  | { type: "nodes:update"; payload: Node[] }
  | { type: "edges:update"; payload: Edge[] }
  | { type: "full:update"; payload: { nodes: Node[]; edges: Edge[] } };
