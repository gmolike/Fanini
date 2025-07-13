export const overridesConfig = [
  // Test Files
  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'max-lines': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },

  // Config Files
  {
    files: ['*.config.{js,ts}', '*.config.*.{js,ts}'],
    rules: {
      'import/no-default-export': 'off',
      'unicorn/filename-case': 'off',
    },
  },

  // Pages (Routes)
  {
    files: ['frontend/src/pages/**/*.{ts,tsx}'],
    rules: {
      // Pages dürfen spezielle Regeln haben
      'boundaries/entry-point': 'off',
    },
  },
  {
    files: ['**/shared/ui/charts/**/*.{ts,tsx}'],
    rules: {
      // React Flow hat nicht perfekte Types, daher lockern
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      // Naming convention exception für 'in-progress'
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'objectLiteralProperty',
          format: null,
          filter: {
            regex: '^(in-progress|[a-zA-Z][a-zA-Z0-9]*)$',
            match: true,
          },
        },
      ],
    },
  },
];
