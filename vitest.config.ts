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

const SRC_ROOT = "generated/claude/api/v1/src";
const TEST_ROOT = "generated/claude/api/v1/test";

export default defineConfig({
  test: {
    // Istanbul instruments source at build time, so it works both for the
    // Node-pool projects below and for the "integration" project, which runs
    // inside workerd — the default v8 provider relies on node:inspector,
    // which workerd only stubs out and cloudflareTest() refuses to run under.
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html", "lcov"],
      include: [`${SRC_ROOT}/**/*.ts`],
      exclude: [`${SRC_ROOT}/index.ts`, `${SRC_ROOT}/types/**`],
    },
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
        plugins: [
          cloudflareTest({
            wrangler: { configPath: "./wrangler.jsonc" },
            miniflare: { bindings: { API_TOKEN: "test-api-token" } },
          }),
        ],
        test: {
          name: "integration",
          include: [`${TEST_ROOT}/integration/**/*.test.ts`],
        },
      },
    ],
  },
});
