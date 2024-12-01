export const CURRENCIES = ["cash", "action_tokens"] as const;
export type Currency = (typeof CURRENCIES)[number];
