export const CURRENCIES = ["cash", "gems"] as const;
export type Currency = (typeof CURRENCIES)[number];
