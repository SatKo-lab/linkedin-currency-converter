import { defineConfig, type Plugin } from "vitest/config";

// Mirrors Wrangler's `rules: [{ type: "Text", globs: ["**/*.csv"] }]` behavior,
// which Vite/Vitest doesn't know about on its own.
function csvAsText(): Plugin {
  return {
    name: "csv-as-text",
    transform(code, id) {
      if (id.endsWith(".csv")) {
        return { code: `export default ${JSON.stringify(code)};`, map: null };
      }
    },
  };
}

export default defineConfig({
  plugins: [csvAsText()],
  test: {
    environment: "node",
  },
});
