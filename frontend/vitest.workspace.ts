import { defineWorkspace } from 'vitest/config';
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';

export default defineWorkspace([
  // Normale Unit Tests
  {
    extends: './vite.config.ts',
    test: {
      include: ['src/**/*.test.{ts,tsx}'],
      exclude: ['src/**/*.stories.tsx'],
      name: 'unit',
    },
  },
  // Storybook Tests
  {
    extends: './vite.config.ts',
    plugins: [
      storybookTest({
        storybookScript: 'pnpm storybook',
      }),
    ],
    test: {
      name: 'storybook',
      include: ['src/**/*.stories.tsx'],
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
      },
    },
  },
]);
