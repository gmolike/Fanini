// eslint.config.mjs (or eslint.config.js with "type": "module")
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import featureSlicedDesign from "eslint-plugin-feature-sliced-design";
import globals from "globals";

export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "*.config.{js,ts}",
      "pnpm-lock.yaml",
    ],
  },

  // Base configuration
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Main configuration for all TypeScript/React files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "feature-sliced-design": featureSlicedDesign,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React rules
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // FSD architecture rules
      "feature-sliced-design/layers-hierarchy": [
        "error",
        {
          alias: "@",
          projectDir: "src",
        },
      ],
      "feature-sliced-design/public-api-slice-import": [
        "error",
        {
          alias: "@",
          projectDir: "src",
        },
      ],
      "feature-sliced-design/relative-path-within-slice": [
        "error",
        {
          alias: "@",
          projectDir: "src",
        },
      ],
    },
  },
);
