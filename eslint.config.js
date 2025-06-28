// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "**/*.gen.ts",
      "**/coverage/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
    },
    settings: {
      react: {
        version: "19.0",
      },
    },
    rules: {
      // React 19 spezifisch
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // React Hooks
      ...reactHooksPlugin.configs.recommended.rules,

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // FSD Import Restrictions
      // In der Import-Plugin Sektion hinzufügen:
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // app kann nur shared importieren
            {
              target: "./src/app",
              from: "./src",
              except: ["./shared"],
              message: "App layer can only import from shared",
            },
            // pages kann widgets, features, entities, shared importieren
            {
              target: "./src/pages",
              from: "./src",
              except: ["./widgets", "./features", "./entities", "./shared"],
              message:
                "Pages can only import from widgets, features, entities, and shared",
            },
            // widgets kann features, entities, shared importieren
            {
              target: "./src/widgets",
              from: "./src",
              except: ["./features", "./entities", "./shared"],
              message:
                "Widgets can only import from features, entities, and shared",
            },
            // features kann entities, shared importieren
            {
              target: "./src/features",
              from: "./src",
              except: ["./entities", "./shared"],
              message: "Features can only import from entities and shared",
            },
            // entities kann nur shared importieren
            {
              target: "./src/entities",
              from: "./src",
              except: ["./shared"],
              message: "Entities can only import from shared",
            },
            // shared kann nichts importieren
            {
              target: "./src/shared",
              from: "./src",
              except: [],
              message: "Shared cannot import from other layers",
            },
          ],
        },
      ],

      // Import Sortierung
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // React
            ["^react", "^react-dom"],
            // External packages
            ["^@?\\w"],
            // Internal - FSD layers (von oben nach unten)
            ["^@/app"],
            ["^@/pages"],
            ["^@/widgets"],
            ["^@/features"],
            ["^@/entities"],
            ["^@/shared"],
            // Relative imports
            ["^\\."],
            // Styles
            ["^.+\\.css$"],
          ],
        },
      ],
    },
  },
);
