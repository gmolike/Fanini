// frontend/src/shared/ui/container/Container.stories.tsx
import { Container } from './Container';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl', 'full'],
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'main'],
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoContent = () => (
  <div className="bg-muted rounded-lg p-8 text-center">
    <h2 className="mb-2 text-lg font-semibold">Container Content</h2>
    <p className="text-muted-foreground">
      Dieser Inhalt ist in einem Container. Die Breite wird durch die size Prop gesteuert.
    </p>
  </div>
);

export const Small: Story = {
  args: {
    size: 'sm',
    children: <DemoContent />,
  },
};

export const Default: Story = {
  args: {
    children: <DemoContent />,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: <DemoContent />,
  },
};

export const Responsive: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="space-y-8">
      {(['sm', 'default', 'lg', 'xl'] as const).map(size => (
        <Container key={size} size={size}>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-center font-mono text-sm">size="{size}"</p>
          </div>
        </Container>
      ))}
    </div>
  ),
};
