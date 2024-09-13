export const CURRENCIES = ["coins", "gems"] as const;
export type Currency = (typeof CURRENCIES)[number];
