import Object from "@rbxts/object-utils";
import { Currency } from "./currency";
import { cases } from "./items/cases";
import { emotes } from "./items/emotes";
import { hats } from "./items/hats";

export const ItemRarityConfig = {
	common: { color: new Color3(1, 1, 1) },
	uncommon: { color: new Color3(0, 1, 0) },
	rare: { color: new Color3(0, 0, 1) },
	epic: { color: new Color3(1, 0, 1) },
	legendary: { color: new Color3(1, 1, 0) },
} as const;

export type Item = {
	id: `${"emote" | "hat" | "case"}_${number}`;
	rarity: keyof typeof ItemRarityConfig;
	name: string;
};

export const allItems = [...cases, ...emotes, ...hats];
export type ItemId = (typeof allItems)[number]["id"];
export const items = new ReadonlyMap<ItemId, Item>(allItems.map((i) => [i.id, i]));
