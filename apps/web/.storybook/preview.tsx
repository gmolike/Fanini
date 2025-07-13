// frontend/.storybook/preview.tsx
import React from 'react';

import '../src/shared/styles/font.css';
import '../src/shared/styles/main.css';
import './storybook-fixes.css';

import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#eff1f3' },
        { name: 'dark', value: '#0f1922' },
        { name: 'fanini-blue', value: '#34687e' },
        { name: 'fanini-red', value: '#b94f46' },
      ],
    },
  },
  decorators: [
    Story => {
      // Stelle sicher, dass das Portal-Root existiert
      React.useEffect(() => {
        // Für Radix UI Portals
        if (!document.getElementById('radix-portal-root')) {
          const portalRoot = document.createElement('div');
          portalRoot.id = 'radix-portal-root';
          document.body.appendChild(portalRoot);
        }
      }, []);

      return (
        <div id="storybook-root" className="relative min-h-[400px] p-4">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
