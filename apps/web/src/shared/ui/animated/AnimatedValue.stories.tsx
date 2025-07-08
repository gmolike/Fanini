// frontend/src/shared/ui/animated/AnimatedValue.stories.tsx
import { AnimatedValue } from './AnimatedValue';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'animated',
  component: AnimatedValue,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    delay: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
    },
    gradient: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof AnimatedValue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NumberValue: Story = {
  args: {
    value: 1234,
  },
};

export const Currency: Story = {
  args: {
    value: 42500,
    format: n => `€ ${n.toLocaleString('de-DE')}`,
  },
};

export const TextContent: Story = {
  args: {
    children: <h2>Willkommen bei der Faninitiative!</h2>,
  },
};

export const GradientText: Story = {
  args: {
    children: <h1>Eintracht Spandau</h1>,
    gradient: true,
    delay: 0.2,
  },
};

export const Dashboard: Story = {
  args: {
    value: 0,
  },
  render: () => (
    <div className="space-y-6 text-center">
      <AnimatedValue delay={0} gradient>
        <h2 className="text-2xl font-bold">Vereinsstatistik 2024</h2>
      </AnimatedValue>

      <div className="grid grid-cols-3 gap-8">
        <div>
          <AnimatedValue value={847} format={n => n.toString()} delay={0.3} />
          <p className="text-muted-foreground mt-1 text-sm">Mitglieder</p>
        </div>
        <div>
          <AnimatedValue value={42} format={n => n.toString()} delay={0.5} />
          <p className="text-muted-foreground mt-1 text-sm">Events</p>
        </div>
        <div>
          <AnimatedValue value={15} format={n => n.toString()} delay={0.7} />
          <p className="text-muted-foreground mt-1 text-sm">Creator</p>
        </div>
      </div>
    </div>
  ),
};
