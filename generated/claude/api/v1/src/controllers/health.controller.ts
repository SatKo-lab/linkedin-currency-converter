import type { Context } from "hono";

export class HealthController {
  hello = (c: Context) => c.json({ message: "Hello World" });
}
