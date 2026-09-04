import { exports } from "cloudflare:workers";
import { describe, it, expect } from "vitest";

describe("worker integration", () => {
  it("responds to GET /api/v1/health inside the real Workers runtime", async () => {
    const response = await exports.default.fetch("https://example.com/api/v1/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Hello World" });
  });

  it("loads exchange rate data through the wrangler.jsonc CSV binding", async () => {
    const response = await exports.default.fetch("https://example.com/api/v1/currencies");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.currencies).toContain("USD");
    expect(body.currencies.length).toBeGreaterThan(1);
  });

  it("converts currencies end-to-end through the deployed worker", async () => {
    const response = await exports.default.fetch(
      "https://example.com/api/v1/convert?from=USD&to=EUR&amount=100"
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ from: "USD", to: "EUR", amount: 100 });
    expect(typeof body.result).toBe("number");
  });

  it("returns a 400 for an unsupported (non-USD pair) conversion", async () => {
    const response = await exports.default.fetch(
      "https://example.com/api/v1/convert?from=CAD&to=EUR&amount=10"
    );
    expect(response.status).toBe(400);
  });

  it("returns a JSON 404 for the bare domain root", async () => {
    const response = await exports.default.fetch("https://example.com/");
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Not Found" });
  });
});
