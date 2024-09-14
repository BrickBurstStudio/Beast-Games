import { Item } from ".";

export type Hat = { meshId: string } & Item;

export const hats = [
	{
		id: "hat_1",
		rarity: "legendary",
		name: "Ghost Fedora",
		meshId: "http://www.roblox.com/asset/?id=13640868",
	},
] as const satisfies Hat[];
