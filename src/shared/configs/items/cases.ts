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
		rarity: "common",
		name: "Common Pet Case",
		type: "pet",

		items: ["emote_1", "emote_2"],
	},
	{
		id: "case_2",
		price: 20_000,
		rarity: "uncommon",
		name: "Uncommon Pet Case",
		type: "pet",
		items: ["emote_1", "emote_2"],
	},
	{
		id: "case_3",
		price: 40_000,
		rarity: "rare",
		name: "Rare Pet Case",
		type: "pet",
		items: ["emote_1", "emote_2"],
	},

	/* --------------------------------- Emotes --------------------------------- */
	{
		id: "case_4",
		price: 10_000,
		rarity: "common",
		name: "Common Emote Case",
		type: "emote",
		items: ["emote_1", "emote_2"],
	},
	{
		id: "case_5",
		price: 20_000,
		rarity: "uncommon",
		name: "Uncommon Emote Case",
		type: "emote",
		items: ["emote_2", "emote_3"],
	},
	{
		id: "case_6",
		price: 40_000,
		rarity: "legendary",
		name: "Rare Emote Case",
		type: "emote",
		items: ["emote_3", "emote_4"],
	},

	/* -------------------------------- Hats -------------------------------- */
	{
		id: "case_7",
		price: 10_000,
		rarity: "common",
		name: "Common Cosmetics Case",
		type: "cosmetic",
		items: ["hat_1", "hat_2"],
	},
	{
		id: "case_8",
		price: 20_000,
		rarity: "uncommon",
		name: "Uncommon Cosmetics Case",
		type: "cosmetic",
		items: ["hat_2", "hat_3"],
	},
	{
		id: "case_9",
		price: 40_000,
		rarity: "rare",
		name: "Rare Cosmetics Case",
		type: "cosmetic",
		items: ["hat_3", "hat_4"],
	},
] as const satisfies Case[];

export function isCase(item: Item): item is Case {
	cases[0].items;
	return "items" in item;
}
