// frontend/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    // Nur shared Layer
    '../src/shared/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    disableTelemetry: true,
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@shared': path.resolve(__dirname, '../src/shared'),
          '@': path.resolve(__dirname, '../src'),
        },
      },
    });
  },
};

export default config;
