import { Hono } from "hono";
import { healthRoutes } from "./routes/health.routes";
import { currencyRoutes } from "./routes/currency.routes";

export const app = new Hono();

app.route("/", healthRoutes);
app.route("/", currencyRoutes);

app.notFound((c) => c.json({ error: "Not Found" }, 404));

export default app;
