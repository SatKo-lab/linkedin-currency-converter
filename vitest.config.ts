import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig, type Plugin } from "vitest/config";

// Mirrors Wrangler's `rules: [{ type: "Text", globs: ["**/*.csv"] }]` behavior,
// which plain Node-environment Vitest projects don't know about on their own.
// Not needed by the "integration" project below — cloudflareTest() honors
// wrangler.jsonc's `rules` directly.
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

const TEST_ROOT = "generated/claude/api/v1/test";

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [csvAsText()],
        test: {
          name: "unit",
          environment: "node",
          include: [`${TEST_ROOT}/unit/**/*.test.ts`],
        },
      },
      {
        plugins: [csvAsText()],
        test: {
          name: "functional",
          environment: "node",
          include: [`${TEST_ROOT}/functional/**/*.test.ts`],
        },
      },
      {
        plugins: [cloudflareTest({ wrangler: { configPath: "./wrangler.jsonc" } })],
        test: {
          name: "integration",
          include: [`${TEST_ROOT}/integration/**/*.test.ts`],
        },
      },
    ],
  },
});
