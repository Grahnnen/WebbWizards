import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
      ecmaVersion: "latest"
    }
  },
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    plugins: { jest },
    languageOptions: {
      globals: globals.jest
    },
    rules: {
      ...jest.configs.recommended.rules
    }
  }
]);
