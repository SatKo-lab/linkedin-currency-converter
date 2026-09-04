import treasuryRatesCsv from "../data/treasury-rates.csv";
import type { CurrencyMap, ConversionResult } from "../types/currency.types";

export class InvalidCurrencyError extends Error {}
export class InvalidAmountError extends Error {}
export class UnsupportedConversionError extends Error {}

const USD = "USD";

export class CurrencyService {
  private readonly rates: CurrencyMap;

  constructor(csvText: string = treasuryRatesCsv) {
    this.rates = CurrencyService.parseCsv(csvText);
    if (!this.rates.has(USD)) {
      throw new Error("Currency data is missing a required USD rate");
    }
  }

  private static parseCsv(text: string): CurrencyMap {
    const rates = new Map<string, number>();
    const effectiveDates = new Map<string, string>();
    const lines = text.trim().split("\n");

    for (const line of lines.slice(1)) {
      const [, , currencyCode, rate, , effectiveDate] = line.split(",").map((value) => value.trim());
      if (!currencyCode || !rate) continue;

      const code = currencyCode.toUpperCase();
      const parsedRate = Number(rate);
      const existingDate = effectiveDates.get(code);

      if (existingDate === undefined || effectiveDate >= existingDate) {
        rates.set(code, parsedRate);
        effectiveDates.set(code, effectiveDate);
      }
    }

    return rates;
  }

  listCurrencies(): string[] {
    return [...this.rates.keys()];
  }

  convert(from: string, to: string, amount: number): ConversionResult {
    if (from !== USD && to !== USD) {
      throw new UnsupportedConversionError(
        `Unsupported conversion: one of "from"/"to" must be USD (got ${from} -> ${to})`
      );
    }

    const fromRate = this.rates.get(from);
    const toRate = this.rates.get(to);

    if (fromRate === undefined) {
      throw new InvalidCurrencyError(`Unknown currency: ${from}`);
    }
    if (toRate === undefined) {
      throw new InvalidCurrencyError(`Unknown currency: ${to}`);
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new InvalidAmountError(`Invalid amount: ${amount}`);
    }

    const amountInUsd = amount / fromRate;
    const rate = toRate / fromRate;
    const result = amountInUsd * toRate;

    return { from, to, amount, rate, result };
  }
}
