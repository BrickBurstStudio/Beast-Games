import { Item } from ".";

export type Hat = { meshId: string } & Item;

export const hats = [
	{
		id: "emote_5",
		rarity: "legendary",
		name: "Schmurda On My Mind",
		meshId: "http://www.roblox.com/asset/?id=13640868",
	},
] as const satisfies Hat[];
