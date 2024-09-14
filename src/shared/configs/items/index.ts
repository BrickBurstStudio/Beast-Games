import { Case, cases } from "./cases";
import { Emote, emotes } from "./emotes";
import { Hat, hats } from "./hats";

export const ItemRarityConfig = {
	common: { color: new Color3(1, 1, 1), weight: 625 },
	uncommon: { color: new Color3(0, 1, 0), weight: 125 },
	rare: { color: new Color3(0, 0, 1), weight: 25 },
	epic: { color: new Color3(1, 0, 1), weight: 5 },
	legendary: { color: new Color3(1, 1, 0), weight: 1 },
} as const;

export const ItemMaxEquipped: Record<EquippableItemType, number> = {
	emote: 3,
	hat: 1,
};

export type ItemType = "emote" | "hat" | "case";
export type EquippableItemType = Exclude<ItemType, "case">;
export type EquippableItemId = Extract<ItemId, `${EquippableItemType}_${number}`>;
export type Item = {
	id: `${ItemType}_${number}`;
	rarity: keyof typeof ItemRarityConfig;
	name: string;
};

export const allItems = [...cases, ...emotes, ...hats];
export type ItemId = (typeof allItems)[number]["id"];
export const items = new ReadonlyMap<ItemId, Item>(allItems.map((i) => [i.id, i]));
