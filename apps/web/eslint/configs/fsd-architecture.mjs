// frontend/eslint/configs/fsd-architecture.mjs
import boundaries from 'eslint-plugin-boundaries';

export const fsdConfig = {
  files: ['src/**/*.{ts,tsx}'],
  plugins: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    boundaries: boundaries,
  },
  settings: {
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app/**/*', mode: 'folder' },
      { type: 'pages', pattern: 'src/pages/**/*', mode: 'folder' },
      { type: 'widgets', pattern: 'src/widgets/**/*', mode: 'folder' },
      { type: 'features', pattern: 'src/features/**/*', mode: 'folder' },
      { type: 'entities', pattern: 'src/entities/**/*', mode: 'folder' },
      { type: 'shared', pattern: 'src/shared/**/*', mode: 'folder' },
    ],
  },
  rules: {
    // Layer Hierarchie - Widgets DÜRFEN features importieren!
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          {
            from: 'app',
            allow: ['pages', 'widgets', 'features', 'entities', 'shared'],
          },
          {
            from: 'pages',
            allow: ['widgets', 'features', 'entities', 'shared'],
          },
          {
            from: 'widgets',
            allow: ['features', 'entities', 'shared'], // ← Hier ist features erlaubt!
          },
          {
            from: 'features',
            allow: ['entities', 'shared'],
          },
          {
            from: 'entities',
            allow: ['shared'],
          },
          {
            from: 'shared',
            allow: ['shared'],
          },
        ],
      },
    ],

    // Public API Entry Points
    'boundaries/entry-point': [
      'error',
      {
        default: 'disallow',
        rules: [
          {
            target: ['app'],
            allow: ['index.(ts|tsx)', '**/*.ts', '**/*.tsx'],
          },
          {
            target: ['pages'],
            allow: ['**/*.ts', '**/*.tsx'],
          },
          {
            target: ['widgets', 'features', 'entities'],
            allow: ['index.(ts|tsx)', '*/index.(ts|tsx)'],
          },
          {
            target: ['shared'],
            allow: ['**/*.ts', '**/*.tsx'],
          },
        ],
      },
    ],
  },
};
