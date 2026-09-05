import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { healthRoutes } from "./routes/health.routes";
import { currencyRoutes } from "./routes/currency.routes";

export type Bindings = {
  API_TOKEN: string;
  RATE_LIMITER: RateLimit;
};

export const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/v1/*", async (c, next) => {
  const key = c.req.header("CF-Connecting-IP") ?? "unknown";
  const { success } = await c.env.RATE_LIMITER.limit({ key });
  if (!success) {
    return c.text("Too Many Requests", 429);
  }
  await next();
});

app.use(
  "/api/v1/*",
  bearerAuth<{ Bindings: Bindings }>({
    verifyToken: (token, c) => token === c.env.API_TOKEN,
  })
);

app.route("/api/v1", healthRoutes);
app.route("/api/v1", currencyRoutes);

app.notFound((c) => c.json({ error: "Not Found" }, 404));

export default app;
