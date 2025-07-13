// frontend/src/shared/lib/storybook/decorators.tsx
import type { Decorator } from '@storybook/react';

/**
 * Decorator für Dark Mode Testing
 */
export const withDarkMode: Decorator = Story => (
  <div style={{ background: '#1a1a1a', padding: '2rem' }}>
    <Story />
  </div>
);

/**
 * Decorator für Mobile Viewport
 */
export const withMobileViewport: Decorator = Story => (
  <div style={{ maxWidth: '375px', margin: '0 auto' }}>
    <Story />
  </div>
);
