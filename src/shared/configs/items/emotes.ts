import { Item } from "../items";

export const emotes = [
	{ id: "emote_1", rarity: "common", name: "Dance Monkey" },
	{ id: "emote_2", rarity: "uncommon", name: "L" },
	{ id: "emote_3", rarity: "rare", name: "Nae Nae" },
	{ id: "emote_4", rarity: "epic", name: "Harlem Shake" },
	{ id: "emote_5", rarity: "legendary", name: "Schmurda On My Mind" },
] as const satisfies Item[];


