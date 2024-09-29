import { ReplicatedStorage } from "@rbxts/services";
import { Item } from ".";

export type Case = {
	price: number;
	// TODO: type guard this to only allow items that are defined in the items array
	items: Item["id"][];
	type: "pet" | "emote" | "cosmetic";
} & Item;

export const cases = [
	{
		id: "case_1",
		price: 10_000,
		model: ReplicatedStorage.Assets.Objects.Box,
		rarity: "common",
		name: "Pet Case",
		type: "pet",
		items: ["emote_1", "emote_2", "emote_3", "emote_4", "emote_5"],
	},
	{
		id: "case_2",
		model: ReplicatedStorage.Assets.Objects.Box,
		price: 10_000,
		rarity: "uncommon",
		name: "Emote Case",
		type: "emote",
		items: ["emote_1", "emote_2", "emote_3"],
	},
	{
		id: "case_3",
		model: ReplicatedStorage.Assets.Objects.Box,
		price: 10_000,
		rarity: "rare",
		name: "Cosmetic Case",
		type: "cosmetic",
		items: ["hat_1", "hat_2", "hat_3", "hat_4"],
	},
] as const satisfies Case[];

export function isCase(item: Item): item is Case {
	cases[0].items;
	return "items" in item;
}
