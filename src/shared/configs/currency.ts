export const CURRENCIES = ["cash", "honor"] as const;
export type Currency = (typeof CURRENCIES)[number];
