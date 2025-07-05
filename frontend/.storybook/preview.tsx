// frontend/.storybook/preview.tsx
import type { Preview } from '@storybook/react';
import '../src/shared/styles/main.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
        { name: 'fanini-blue', value: '#34687e' },
        { name: 'fanini-red', value: '#dc2626' },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
      },
    },
  },

  decorators: [
    Story => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default preview;
