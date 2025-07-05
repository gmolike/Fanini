// frontend/src/shared/ui/button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

// Dummy Button für Test
const Button = ({ children, ...props }: any) => <button {...props}>{children}</button>;

const meta: Meta<typeof Button> = {
  title: 'Test/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Test Button',
  },
};
