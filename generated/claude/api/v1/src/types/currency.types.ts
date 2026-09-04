export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  rate: number;
  result: number;
}

export type CurrencyMap = ReadonlyMap<string, number>;
