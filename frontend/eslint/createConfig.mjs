import tseslint from 'typescript-eslint';

export function createConfig(...configs) {
  return tseslint.config(
    ...configs.flat(),
    // Globale Ignores am Ende
    {
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/coverage/**',
        '**/*.min.js',
        '**/routeTree.gen.ts',
        'backend/**',
        'eslint.config.*',
        '**/shadcn/**/*.tsx',
      ],
    }
  );
}
