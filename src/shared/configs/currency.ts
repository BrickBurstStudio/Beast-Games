export const CURRENCIES = ["cash", "action_token"] as const;
export type Currency = (typeof CURRENCIES)[number];
