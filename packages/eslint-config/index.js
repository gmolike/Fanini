module.exports = {
  base: {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  react: {
    plugins: ["react", "react-hooks"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
    },
  },
  node: {
    env: { node: true },
    rules: {
      "no-console": "off", // Different for backend
    },
  },
};
