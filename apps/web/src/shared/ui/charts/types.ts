// frontend/src/shared/ui/charts/types.ts
export type OrgChartNode = {
  readonly id: string;
  readonly label: string;
  readonly department: string;
  readonly level: number;
  readonly type: 'board' | 'advisory' | 'team';
  readonly parentId?: string;
  readonly memberCount?: number;
};

export type OrgChartProps = {
  readonly nodes: OrgChartNode[];
  readonly onNodeClick?: (node: OrgChartNode) => void;
  readonly className?: string;
  readonly expandable?: boolean;
};

export type WorkflowStep = {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly status: 'pending' | 'active' | 'completed' | 'error';
  readonly assignee?: string;
  readonly dueDate?: string;
};

export type WorkflowChartProps = {
  readonly steps: WorkflowStep[];
  readonly onStepClick?: (step: WorkflowStep) => void;
  readonly className?: string;
  readonly orientation?: 'vertical' | 'horizontal';
};

export type RACIRole = 'responsible' | 'accountable' | 'consulted' | 'informed';

export type RACIAssignment = {
  readonly taskId: string;
  readonly taskName: string;
  readonly assignments: ReadonlyMap<string, RACIRole>;
};

export type RACIMatrixProps = {
  readonly assignments: readonly RACIAssignment[];
  readonly people: readonly string[];
  readonly onCellClick?: (task: string, person: string, role: RACIRole) => void;
  readonly className?: string;
};
