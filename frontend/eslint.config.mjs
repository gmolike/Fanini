import rootConfig from '../eslint.config.mjs'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'

export default [
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-interface': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'func-style': [
        'error',
        'expression',
        {
          allowArrowFunctions: true,
        },
      ],
      'no-function-expression': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
      ],
    },
  },
]
