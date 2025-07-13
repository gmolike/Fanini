// frontend/eslint/configs/imports-exports.mjs
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export const importsConfig = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    import: importPlugin,
    'simple-import-sort': simpleImportSort,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // Simple Import Sort - für Imports UND Exports
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // React zuerst
          ['^react', '^react-dom'],
          // Externe packages
          ['^@?\\w'],
          // Interne imports (FSD Layer)
          ['^@/app(/.*|$)'],
          ['^@/pages(/.*|$)'],
          ['^@/widgets(/.*|$)'],
          ['^@/features(/.*|$)'],
          ['^@/entities(/.*|$)'],
          ['^@/shared(/.*|$)'],
          // Parent imports
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Relative imports
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports
          ['^.+\\.s?css$'],
          // Type imports
          ['^.*\\u0000$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',

    // WICHTIG: import/order ausschalten!
    'import/order': 'off',

    // Import/Export Qualität (diese kollidieren nicht)
    'import/no-duplicates': ['error', { 'prefer-inline': true }],
    'import/export': 'error',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
  },
};
