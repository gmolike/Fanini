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
];
