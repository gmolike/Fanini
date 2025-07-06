/* eslint-disable @typescript-eslint/naming-convention */
// frontend/.storybook/main.ts
import autoprefixer from 'autoprefixer';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { mergeConfig } from 'vite';

import type { StorybookConfig } from '@storybook/react-vite';

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

  viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@shared': path.resolve(__dirname, '../src/shared'),
          '@': path.resolve(__dirname, '../src'),
        },
      },
      // Stelle sicher, dass PostCSS und Tailwind korrekt geladen werden
      plugins: [],
      css: {
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      },
    });
  },
};

export default config;
