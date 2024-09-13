import Object from "@rbxts/object-utils";
import { Currency } from "./Currency";
import BaseItem from "shared/classes/items/BaseItem";
import { cases } from "./items/cases";
import { emotes } from "./items/emotes";

export const ItemRarityConfig = {
	common: { color: new Color3(1, 1, 1), cost: 200 },
	uncommon: { color: new Color3(0, 1, 0), cost: 350 },
	rare: { color: new Color3(0, 0, 1), cost: 600 },
	epic: { color: new Color3(1, 0, 1), cost: 1000 },
	legendary: { color: new Color3(1, 1, 0), cost: 1300 },
} as const;

export type ItemRarity = keyof typeof ItemRarityConfig;

export const items = new Map<BaseItem["id"], BaseItem>();

[...cases, ...emotes].forEach((item) => items.set(item.id, item));
