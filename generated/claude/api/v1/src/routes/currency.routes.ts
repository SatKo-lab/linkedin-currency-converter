import { Hono } from "hono";
import { CurrencyService } from "../services/currency.service";
import { CurrencyController } from "../controllers/currency.controller";

const currencyService = new CurrencyService();
const currencyController = new CurrencyController(currencyService);

export const currencyRoutes = new Hono()
  .get("/convert", currencyController.convert)
  .get("/currencies", currencyController.listCurrencies);
