import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

export const reactConfig = {
  files: ['**/*.{jsx,tsx}'],
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'react-refresh': reactRefreshPlugin,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React 19 - Kein Import nötig
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off',

    // JSX Style
    'react/jsx-pascal-case': [
      'error',
      {
        allowAllCaps: false,
        allowNamespace: false,
        allowLeadingUnderscore: false,
      },
    ],
    'react/jsx-boolean-value': ['error', 'never'],
    'react/self-closing-comp': 'error',
    'react/jsx-curly-brace-presence': [
      'error',
      {
        props: 'never',
        children: 'never',
      },
    ],

    // Best Practices
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

    // Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React Refresh
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true,
      },
    ],
  },
};
