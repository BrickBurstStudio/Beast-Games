import { Currency } from "./Currency";

export const HOLDER_PAGES = ["Settings", "Shop"] as const;
export type HolderPage = (typeof HOLDER_PAGES)[number];

export const COLORS = {
  PrimaryBackground: Color3.fromRGB(0, 163, 255),
  SecondaryBackground: Color3.fromRGB(0, 137, 215),

  Buttons: {
    Off: Color3.fromRGB(232, 70, 70),
    On: Color3.fromRGB(61, 220, 68),
  },

  White: Color3.fromRGB(255, 255, 255),
};

export const IMAGES = {
  coins: "15416676802",
  gems: "15416675953",
  settings: "16545611198",
  shop: "9405933234",
} as const;

export type ImageName = keyof typeof IMAGES;
