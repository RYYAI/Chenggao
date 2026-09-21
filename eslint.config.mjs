import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
  { ignores: ["main.js", "*.mjs", "scripts/**", "node_modules/**"] },
  ...obsidianmd.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // Match the community scanner: these are warnings on the Scorecard, not listing blockers.
      "obsidianmd/no-static-styles-assignment": "warn",
      "obsidianmd/platform": "warn",
      "no-useless-escape": "warn",
      "no-empty": "warn",
      "no-irregular-whitespace": "warn",
    },
  },
]);
