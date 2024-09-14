import { Case } from "shared/classes/items/Case";

const test = [
	{
		x: "hi",
	},
	{
		x: "bye",
	},
] as const;

// let x: (typeof test)[number]["x"][] = ["hi"];

export const cases = [
	/* ---------------------------------- Pets ---------------------------------- */
	new Case({
		id: "case_1",
		price: 10_000,
		rarity: "common",
		name: "Common Pet Case",
		type: "pet",

		items: ["emote_1", "emote_2"],
	}),
	new Case({
		id: "case_2",
		price: 20_000,
		rarity: "uncommon",
		name: "Uncommon Pet Case",
		type: "pet",
		items: ["emote_1", "emote_2"],
	}),
	new Case({
		id: "case_3",
		price: 40_000,
		rarity: "rare",
		name: "Rare Pet Case",
		type: "pet",
		items: ["emote_1", "emote_2"],
	}),

	/* --------------------------------- Emotes --------------------------------- */
	new Case({
		id: "case_4",
		price: 10_000,
		rarity: "common",
		name: "Common Emote Case",
		type: "emote",
		items: ["emote_1", "emote_2"],
	}),
	new Case({
		id: "case_5",
		price: 20_000,
		rarity: "uncommon",
		name: "Uncommon Emote Case",
		type: "emote",
		items: ["emote_2", "emote_3"],
	}),
	new Case({
		id: "case_6",
		price: 40_000,
		rarity: "rare",
		name: "Rare Emote Case",
		type: "emote",
		items: ["emote_3", "emote_4"],
	}),
];
