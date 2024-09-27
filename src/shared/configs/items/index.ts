import { ReplicatedStorage } from "@rbxts/services";
import { cases } from "./cases";
import { emotes } from "./emotes";
import { hats } from "./hats";

export const ItemRarityConfig = {
	common: { color: new Color3(1, 1, 1), weight: 625, sound: ReplicatedStorage.Assets.Sounds.UnboxCommon },
	uncommon: {
		color: new Color3(0, 1, 0),
		weight: 125,
		sound: ReplicatedStorage.Assets.Sounds.UnboxCommon,
	},
	rare: {
		color: new Color3(0, 0, 1),
		weight: 25,
		sound: ReplicatedStorage.Assets.Sounds.UnboxRare,
	},
	epic: {
		color: new Color3(1, 0, 1),
		weight: 5,
		sound: ReplicatedStorage.Assets.Sounds.UnboxRare,
	},
	legendary: {
		color: new Color3(1, 1, 0),
		weight: 1,
		sound: ReplicatedStorage.Assets.Sounds.UnboxLegendary,
	},
} as const satisfies Record<string, { color: Color3; weight: number; sound: Sound }>;

export const ItemMaxEquipped: Record<EquippableItemType, number> = {
	emote: 3,
	hat: 1,
};

export type ItemType = "emote" | "hat" | "case";
export type EquippableItemType = Exclude<ItemType, "case">;
export type EquippableItemId = Extract<ItemId, `${EquippableItemType}_${number}`>;
export type Item = {
	// TODO: Find a way to fix this within flamework, otherwise make a test on CI to check for all ids to be unique and pass this constraint
	// id: `${ItemType}_${number}`;
	id: string;
	rarity: keyof typeof ItemRarityConfig;
	name: string;
	model: Model;
};

export const allItems = [...cases, ...emotes, ...hats] as const;
export type ItemId = (typeof allItems)[number]["id"];
export const items = new ReadonlyMap<ItemId, Item>(allItems.map((i) => [i.id, i]));
