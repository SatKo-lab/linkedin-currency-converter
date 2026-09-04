import { describe, it, expect } from "vitest";
import {
  CurrencyService,
  InvalidCurrencyError,
  InvalidAmountError,
  UnsupportedConversionError,
} from "../../src/services/currency.service";

const csv = [
  "country,currency,currency_code,rate,record_date,effective_date",
  "United States,Dollar,USD,1.0,2026-06-30,2026-06-30",
  "Euro Zone,Euro,EUR,0.92,2026-06-30,2026-06-30",
  "Japan,Yen,JPY,147.50,2026-06-30,2026-06-30",
  "Canada,Dollar,CAD,1.36,2026-06-30,2026-06-30",
].join("\n");

describe("CurrencyService", () => {
  const service = new CurrencyService(csv);

  it("lists currency codes from the CSV", () => {
    expect(service.listCurrencies()).toEqual(["USD", "EUR", "JPY", "CAD"]);
  });

  it("converts USD -> X (USD as source)", () => {
    const result = service.convert("USD", "EUR", 100);
    expect(result).toEqual({ from: "USD", to: "EUR", amount: 100, rate: 0.92, result: 92 });
  });

  it("converts X -> USD (USD as target)", () => {
    const result = service.convert("EUR", "USD", 92);
    expect(result.result).toBeCloseTo(100);
  });

  it("rejects non-USD-pair conversions", () => {
    expect(() => service.convert("CAD", "EUR", 10)).toThrow(UnsupportedConversionError);
  });

  it("throws InvalidCurrencyError for an unknown currency code", () => {
    expect(() => service.convert("USD", "XXX", 10)).toThrow(InvalidCurrencyError);
    expect(() => service.convert("XXX", "USD", 10)).toThrow(InvalidCurrencyError);
  });

  it("throws InvalidAmountError for a non-positive or non-finite amount", () => {
    expect(() => service.convert("USD", "EUR", 0)).toThrow(InvalidAmountError);
    expect(() => service.convert("USD", "EUR", -5)).toThrow(InvalidAmountError);
    expect(() => service.convert("USD", "EUR", NaN)).toThrow(InvalidAmountError);
  });

  it("keeps the most recent rate when a currency code repeats", () => {
    const dupCsv = [
      "country,currency,currency_code,rate,record_date,effective_date",
      "United States,Dollar,USD,1.0,2026-06-30,2026-06-30",
      "Bolivia,Boliviano,BOB,6.85,2026-06-30,2026-06-30",
      "Bolivia,Boliviano,BOB,10.35,2026-06-30,2026-07-15",
    ].join("\n");
    const svc = new CurrencyService(dupCsv);
    expect(svc.convert("USD", "BOB", 1).rate).toBe(10.35);
  });
});
