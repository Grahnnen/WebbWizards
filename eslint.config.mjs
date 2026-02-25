import js from "@eslint/js";
import globals from "globals";
import jest from "eslint-plugin-jest";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    ignores: [
      "coverage/**",
      "**/lcov-report/**",
      "dist/**",
      "build/**",
      "node_modules/**",
    ],
  },
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
    files: ["*.config.js", "*.config.cjs", "babel.config.js", "jest.config.cjs"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs"
    }
  },
  {
  files: ["jest.setup.js", "**/*.test.js", "**/__tests__/**/*.js"],
  plugins: { jest },
  languageOptions: {
    globals: {
      ...globals.jest,
      ...globals.node,
    },
  },
  rules: {
    ...jest.configs.recommended.rules,
  },
}
]);
