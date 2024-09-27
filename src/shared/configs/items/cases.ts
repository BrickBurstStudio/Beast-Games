import { ReplicatedStorage } from "@rbxts/services";
import { Item } from ".";

export type Case = {
	price: number;
	items: Item["id"][];
	type: "pet" | "emote" | "cosmetic";
} & Item;

export const cases = [
	/* ---------------------------------- Pets ---------------------------------- */
	{
		id: "case_1",
		price: 10_000,
		model: ReplicatedStorage.Assets.Objects.Box,
		rarity: "common",
		name: "Common Pet Case",
		type: "pet",
		items: ["emote_1", "emote_2"],
	},
	{
		id: "case_2",
		model: ReplicatedStorage.Assets.Objects.Box,
		price: 20_000,
		rarity: "uncommon",
		name: "Uncommon Pet Case",
		type: "pet",
		items: ["emote_1", "emote_2", "emote_3"],
	},
	{
		id: "case_3",
		model: ReplicatedStorage.Assets.Objects.Box,
		price: 40_000,
		rarity: "rare",
		name: "Rare Pet Case",
		type: "pet",
		items: ["emote_1", "emote_2", "emote_3", "emote_4"],
	},

	/* --------------------------------- Emotes --------------------------------- */
	{
		id: "case_4",
		model: ReplicatedStorage.Assets.Objects.Box,
		price: 10_000,
		rarity: "common",
		name: "Common Emote Case",
		type: "emote",
		items: ["emote_1", "emote_2"],
	},
	{
		id: "case_5",
		model: ReplicatedStorage.Assets.Objects.Box,
		price: 20_000,
		rarity: "uncommon",
		name: "Uncommon Emote Case",
		type: "emote",
		items: ["emote_1", "emote_2", "emote_3"],
	},
	{
		id: "case_6",
		model: ReplicatedStorage.Assets.Objects.Box,
		price: 40_000,
		rarity: "legendary",
		name: "Rare Emote Case",
		type: "emote",
		items: ["emote_1", "emote_2", "emote_3", "emote_4"],
	},

	/* -------------------------------- Hats -------------------------------- */
	{
		id: "case_7",
		model: ReplicatedStorage.Assets.Objects.Box,
		price: 10_000,
		rarity: "common",
		name: "Common Cosmetics Case",
		type: "cosmetic",
		items: ["hat_1", "hat_2"],
	},
	{
		id: "case_8",
		model: ReplicatedStorage.Assets.Objects.Box,
		price: 20_000,
		rarity: "uncommon",
		name: "Uncommon Cosmetics Case",
		type: "cosmetic",
		items: ["hat_1", "hat_2", "hat_3"],
	},
	{
		id: "case_9",
		model: ReplicatedStorage.Assets.Objects.Box,
		price: 40_000,
		rarity: "rare",
		name: "Rare Cosmetics Case",
		type: "cosmetic",
		items: ["hat_1", "hat_2", "hat_3", "hat_4"],
	},
] as const satisfies Case[];

export function isCase(item: Item): item is Case {
	cases[0].items;
	return "items" in item;
}
