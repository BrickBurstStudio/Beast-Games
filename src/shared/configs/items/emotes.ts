import { Item } from ".";

export type Emote = { animationId: string } & Item;

export const emotes = [
	{ id: "emote_1", rarity: "common", name: "Dance Monkey", animationId: "http://www.roblox.com/asset/?id=125750702" },
	{ id: "emote_2", rarity: "uncommon", name: "L", animationId: "http://www.roblox.com/asset/?id=125750702" },
	{ id: "emote_3", rarity: "rare", name: "Nae Nae", animationId: "http://www.roblox.com/asset/?id=125750702" },
	{ id: "emote_4", rarity: "epic", name: "Harlem Shake", animationId: "http://www.roblox.com/asset/?id=125750702" },
	{
		id: "emote_5",
		rarity: "legendary",
		name: "Schmurda On My Mind",
		animationId: "http://www.roblox.com/asset/?id=125750702",
	},
] as const satisfies Emote[];

export function isEmote(item: Item): item is Emote {
	emotes[0].animationId;
	return "animationId" in item;
}
