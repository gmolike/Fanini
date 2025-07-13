/* eslint-disable no-console */
// frontend/src/shared/ui/charts/Charts.stories.tsx
import { OrgChart, RACIMatrix, WorkflowChart } from './index';

import type { OrgChartNode, RACIAssignment, WorkflowStep } from './types';
import type { StoryObj } from '@storybook/react';

const meta = {
  title: 'charts',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

// OrgChart Story
export const Organization: StoryObj = {
  render: () => {
    const nodes: OrgChartNode[] = [
      {
        id: '1',
        label: 'Vorstand',
        department: 'Vereinsführung',
        level: 0,
        type: 'board',
        memberCount: 5,
      },
      {
        id: '2',
        label: 'Beirat',
        department: 'Beratung',
        level: 0,
        type: 'advisory',
        memberCount: 8,
      },
      {
        id: '3',
        label: 'Team Event',
        department: 'Veranstaltungen',
        level: 1,
        type: 'team',
        parentId: '1',
        memberCount: 12,
      },
      {
        id: '4',
        label: 'Team Medien',
        department: 'Öffentlichkeitsarbeit',
        level: 1,
        type: 'team',
        parentId: '1',
        memberCount: 6,
      },
      {
        id: '5',
        label: 'Team Technik',
        department: 'IT & Infrastruktur',
        level: 1,
        type: 'team',
        parentId: '1',
        memberCount: 4,
      },
      {
        id: '6',
        label: 'Team Verein',
        department: 'Mitgliederverwaltung',
        level: 1,
        type: 'team',
        parentId: '1',
        memberCount: 7,
      },
    ];

    return (
      <OrgChart
        nodes={nodes}
        expandable
        onNodeClick={node => {
          console.log('Clicked:', node);
        }}
      />
    );
  },
};

// WorkflowChart Story
export const Workflow: StoryObj = {
  render: () => {
    const steps: WorkflowStep[] = [
      {
        id: '1',
        label: 'Event erstellen',
        description: 'Neues Event im System anlegen',
        status: 'completed',
        assignee: 'Max Mustermann',
      },
      {
        id: '2',
        label: 'Genehmigung einholen',
        description: 'Vorstand muss Event genehmigen',
        status: 'active',
        assignee: 'Vorstand',
        dueDate: '15.03.2024',
      },
      {
        id: '3',
        label: 'Event veröffentlichen',
        description: 'Auf Website und Social Media',
        status: 'pending',
        assignee: 'Team Medien',
      },
      {
        id: '4',
        label: 'Anmeldungen verwalten',
        description: 'Teilnehmer registrieren',
        status: 'pending',
      },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Vertikal</h3>
          <WorkflowChart
            steps={steps}
            onStepClick={step => {
              console.log('Clicked:', step);
            }}
          />
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Horizontal</h3>
          <WorkflowChart
            steps={steps}
            orientation="horizontal"
            onStepClick={step => {
              console.log('Clicked:', step);
            }}
          />
        </div>
      </div>
    );
  },
};

// RACIMatrix Story
export const RACI: StoryObj = {
  render: () => {
    const assignments: RACIAssignment[] = [
      {
        taskId: '1',
        taskName: 'Event planen',
        assignments: new Map([
          ['Max', 'responsible'],
          ['Anna', 'accountable'],
          ['Tom', 'consulted'],
        ]),
      },
      {
        taskId: '2',
        taskName: 'Budget erstellen',
        assignments: new Map([
          ['Anna', 'responsible'],
          ['Tom', 'accountable'],
          ['Lisa', 'informed'],
        ]),
      },
      {
        taskId: '3',
        taskName: 'Genehmigung einholen',
        assignments: new Map([
          ['Tom', 'responsible'],
          ['Max', 'consulted'],
          ['Lisa', 'informed'],
          ['Anna', 'informed'],
        ]),
      },
      {
        taskId: '4',
        taskName: 'Durchführung',
        assignments: new Map([
          ['Max', 'responsible'],
          ['Tom', 'accountable'],
          ['Anna', 'consulted'],
          ['Lisa', 'consulted'],
        ]),
      },
    ];

    const people = ['Max', 'Anna', 'Tom', 'Lisa'];

    return (
      <RACIMatrix
        assignments={assignments}
        people={people}
        onCellClick={(task, person, role) => {
          console.log(`${person} ist ${role} für ${task}`);
        }}
      />
    );
  },
};
