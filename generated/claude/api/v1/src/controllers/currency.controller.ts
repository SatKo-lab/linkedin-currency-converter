import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  CurrencyService,
  InvalidCurrencyError,
  InvalidAmountError,
  UnsupportedConversionError,
} from "../services/currency.service";

export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  convert = (c: Context) => {
    const from = c.req.query("from");
    const to = c.req.query("to");
    const amountRaw = c.req.query("amount");

    if (!from || !to || !amountRaw) {
      throw new HTTPException(400, { message: "from, to, and amount are required" });
    }

    const amount = Number(amountRaw);

    try {
      const result = this.currencyService.convert(from.toUpperCase(), to.toUpperCase(), amount);
      return c.json(result);
    } catch (err) {
      if (
        err instanceof InvalidCurrencyError ||
        err instanceof InvalidAmountError ||
        err instanceof UnsupportedConversionError
      ) {
        throw new HTTPException(400, { message: err.message });
      }
      throw err;
    }
  };

  listCurrencies = (c: Context) => {
    return c.json({ currencies: this.currencyService.listCurrencies() });
  };
}
