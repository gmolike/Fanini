// frontend/src/shared/ui/button/Button.stories.tsx
import { Mail, Plus, Trash2 } from 'lucide-react';

import { ButtonGroup } from './ui/ButtonGroup';
import { Button } from './Button';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Mail className="mr-2 h-4 w-4" />
        Email senden
      </>
    ),
  },
};

export const Loading: Story = {
  args: {
    children: 'Speichern',
    loading: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="space-y-4">
      <ButtonGroup>
        <Button variant="outline">Bearbeiten</Button>
        <Button variant="outline">Duplizieren</Button>
        <Button variant="outline">
          <Trash2 className="h-4 w-4" />
        </Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical">
        <Button variant="outline">Option 1</Button>
        <Button variant="outline">Option 2</Button>
        <Button variant="outline">Option 3</Button>
      </ButtonGroup>
    </div>
  ),
};
