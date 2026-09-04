import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("routes", () => {
  it("GET /api/v1/health returns a hello world message", async () => {
    const res = await app.request("/api/v1/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello World" });
  });

  it("GET /api/v1/currencies lists the available currencies", async () => {
    const res = await app.request("/api/v1/currencies");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.currencies).toContain("USD");
  });

  it("GET /api/v1/convert converts between currencies", async () => {
    const res = await app.request("/api/v1/convert?from=USD&to=EUR&amount=100");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ from: "USD", to: "EUR", amount: 100 });
  });

  it("GET /api/v1/convert with an unknown currency returns 400", async () => {
    const res = await app.request("/api/v1/convert?from=XXX&to=USD&amount=10");
    expect(res.status).toBe(400);
  });

  it("GET /api/v1/convert with a missing param returns 400", async () => {
    const res = await app.request("/api/v1/convert?from=USD&to=EUR");
    expect(res.status).toBe(400);
  });

  it("GET /api/v1/convert with a non-USD pair returns 400 (unsupported conversion)", async () => {
    const res = await app.request("/api/v1/convert?from=CAD&to=EUR&amount=10");
    expect(res.status).toBe(400);
  });

  it("unknown routes return a JSON 404", async () => {
    const res = await app.request("/nope");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not Found" });
  });

  it("GET / (bare root) is no longer served and returns a JSON 404", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not Found" });
  });
});
