export const CURRENCIES = ["cash"] as const;
export type Currency = (typeof CURRENCIES)[number];
