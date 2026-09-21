import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
  { ignores: ["main.js", "*.mjs", "scripts/**", "node_modules/**", "test-vault/**"] },
  ...obsidianmd.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "no-useless-escape": "warn",
      "no-empty": "warn",
      "no-irregular-whitespace": "warn",
    },
  },
]);
