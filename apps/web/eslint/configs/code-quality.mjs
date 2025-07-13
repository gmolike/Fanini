// import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';

export const codeQualityConfig = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    // sonarjs: sonarjs,
    unicorn: unicorn,
  },
  rules: {
    // SonarJS
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicate-string': ['error', { threshold: 5 }],
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-collapsible-if': 'error',

    // Unicorn
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
          kebabCase: true,
        },
        ignore: ['^\\[.*\\].*\\.tsx?$'],
      },
    ],
    'unicorn/no-null': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-top-level-await': 'off',

    // General Best Practices
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-template': 'error',
    'prefer-destructuring': ['error', { array: false, object: true }],
    'no-nested-ternary': 'error',
    'max-depth': ['error', 4],
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    complexity: ['error', 20],
  },
};
