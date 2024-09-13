export const CURRENCIES = ["cash", "gems", "honor"] as const;
export type Currency = (typeof CURRENCIES)[number];
