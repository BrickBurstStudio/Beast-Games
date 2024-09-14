import { Item } from ".";

export type Hat = { hatMeshId: string } & Item;

export const hats = [
	{
		id: "hat_1",
		rarity: "legendary",
		name: "Ghost Fedora",
		hatMeshId: "http://www.roblox.com/asset/?id=13640868",
	},
] as const satisfies Hat[];

export function isHat(item: Item): item is Hat {
	hats[0].hatMeshId;
	return "hatMeshId" in item;
}
