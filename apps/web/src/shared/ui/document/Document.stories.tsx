// frontend/src/shared/ui/document/Document.stories.tsx
import { PdfViewer } from './PdfViewer';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'document',
  component: PdfViewer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PdfViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: '/dokumente/Satzung.pdf',
    title: 'Vereinssatzung',
  },
  decorators: [
    Story => (
      <div className="h-screen p-4">
        <Story />
      </div>
    ),
  ],
};

export const CustomHeight: Story = {
  args: {
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    title: 'Protokoll Mitgliederversammlung',
    className: 'h-[600px]',
  },
  decorators: [
    Story => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};
