import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Basis Configs
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  prettierConfig,

  // Globale Einstellungen
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        project: './tsconfig.json', // Nur noch eine Datei
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        __DEV__: 'readonly',
        __PROD__: 'readonly',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      // FSD Architecture Definition
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**/*', mode: 'folder' },
        { type: 'pages', pattern: 'src/pages/**/*', mode: 'folder' },
        { type: 'widgets', pattern: 'src/widgets/**/*', mode: 'folder' },
        { type: 'features', pattern: 'src/features/**/*', mode: 'folder' },
        { type: 'entities', pattern: 'src/entities/**/*', mode: 'folder' },
        { type: 'shared', pattern: 'src/shared/**/*', mode: 'folder' },
      ],
    },
  },

  // TypeScript & JavaScript Files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      boundaries: boundaries,
      import: importPlugin,
      unicorn: unicorn,
    },

    rules: {
      // TypeScript Strict Rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: true, // "" als falsy erlauben
          allowNumber: true, // 0 als falsy erlauben
          allowNullableObject: true, // Objekte ohne expliziten null check
          allowNullableBoolean: true,
          allowNullableString: true,
          allowNullableNumber: true,
          allowAny: false,
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        // PascalCase für Typen
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // PascalCase für Komponenten (Funktionen die mit großem Buchstaben beginnen)
        {
          selector: 'function',
          format: ['PascalCase', 'camelCase'],
          leadingUnderscore: 'allow',
        },
        // camelCase für Variablen
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        // camelCase für Parameter
        {
          selector: 'parameter',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        // camelCase für member
        {
          selector: 'memberLike',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
          filter: {
            regex: '^(\\d+|[A-Z_]+)$', // Zahlen oder UPPER_CASE
            match: true,
          },
        },
        {
          selector: 'objectLiteralProperty',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          filter: {
            regex: '^(Content-Type|Authorization|X-.*|VITE_.*)$',
            match: false,
          },
        },
      ],

      // React 19 Rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-pascal-case': [
        'error',
        {
          allowAllCaps: false,
          allowNamespace: false,
          allowLeadingUnderscore: false,
        },
      ],
      'react/jsx-no-leaked-render': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
        },
      ],
      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true,
        },
      ],
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      // FSD Boundaries - Strikte Layer-Hierarchie
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
              allow: ['features', 'entities', 'shared'],
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

      // FSD Public API - Nur index.ts imports erlaubt
      'boundaries/entry-point': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              target: ['app', 'pages', 'widgets', 'features', 'entities'],
              allow: 'index.(ts|tsx)',
            },
            {
              target: ['shared'],
              allow: ['**/*.ts', '**/*.tsx'],
            },
          ],
        },
      ],

      // Import Rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'type'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@app/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@pages/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@widgets/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@features/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@entities/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@shared/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',

      // SonarJS Rules
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': [
        'error',
        {
          threshold: 5,
        },
      ],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-collapsible-if': 'error',

      // Unicorn Best Practices
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
            kebabCase: true,
          },
          ignore: ['^\\[.*\\].*\\.tsx?$'], // Next.js dynamic routes
        },
      ],
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-top-level-await': 'off',

      // General Best Practices
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
      ],
      'no-nested-ternary': 'error',
      'max-depth': ['error', 4],
      'max-lines': [
        'error',
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      complexity: ['error', 20],
    },
  },

  // Test Files - Lockere Regeln
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

  // Ignore Patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.min.js',
      '**/routeTree.gen.ts',
      'backend/**', // Backend wird separat gelintet
      'eslint.config.*', // Ignore ESLint config files to avoid TS project errors
      'eslint.config.mjs', // Explicitly ignore this config file
      'frontend/src/pages/**/*.tsx',
      'frontend/src/pages/**/*.ts',
    ],
  }
);
