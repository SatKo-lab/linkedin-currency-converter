import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("routes", () => {
  it("GET / returns a hello world message", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello World" });
  });

  it("GET /currencies lists the available currencies", async () => {
    const res = await app.request("/currencies");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.currencies).toContain("USD");
  });

  it("GET /convert converts between currencies", async () => {
    const res = await app.request("/convert?from=USD&to=EUR&amount=100");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ from: "USD", to: "EUR", amount: 100 });
  });

  it("GET /convert with an unknown currency returns 400", async () => {
    const res = await app.request("/convert?from=XXX&to=USD&amount=10");
    expect(res.status).toBe(400);
  });

  it("GET /convert with a missing param returns 400", async () => {
    const res = await app.request("/convert?from=USD&to=EUR");
    expect(res.status).toBe(400);
  });

  it("GET /convert with a non-USD pair returns 400 (unsupported conversion)", async () => {
    const res = await app.request("/convert?from=CAD&to=EUR&amount=10");
    expect(res.status).toBe(400);
  });

  it("unknown routes return a JSON 404", async () => {
    const res = await app.request("/nope");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not Found" });
  });
});
