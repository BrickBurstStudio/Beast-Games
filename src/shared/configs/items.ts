import Object from "@rbxts/object-utils";
import { Currency } from "./Currency";
import BaseItem from "shared/Items/BaseItem";
import Outfit from "shared/Items/Outfit";

export const ItemRarityConfig = {
	common: { color: new Color3(1, 1, 1), cost: 200 },
	uncommon: { color: new Color3(0, 1, 0), cost: 350 },
	rare: { color: new Color3(0, 0, 1), cost: 600 },
	epic: { color: new Color3(1, 0, 1), cost: 1000 },
	legendary: { color: new Color3(1, 1, 0), cost: 1300 },
} as const;

export type ItemRarity = keyof typeof ItemRarityConfig;

export const items = new Map<BaseItem["id"], BaseItem>();

export const outfits: Outfit[] = [
	// new Outfit({
	//   id: "1",
	//   material: Enum.Material.Neon,
	//   currency: "coins",
	//   rarity: "legendary",
	//   stackable: false,
	// }),
	// new Outfit({
	//   id: "2",
	//   material: Enum.Material.Concrete,
	//   currency: "coins",
	//   rarity: "common",
	//   stackable: false,
	// }),
	// new Outfit({
	//   id: "3",
	//   material: Enum.Material.Glass,
	//   currency: "coins",
	//   rarity: "legendary",
	//   stackable: false,
	// }),
	// new Outfit({
	//   id: "4",
	//   material: Enum.Material.Brick,
	//   currency: "coins",
	//   rarity: "epic",
	//   stackable: false,
	// }),
	// new Outfit({
	//   id: "5",
	//   material: Enum.Material.Mud,
	//   currency: "coins",
	//   rarity: "uncommon",
	//   stackable: false,
	// }),
];

outfits.forEach((item) => items.set(item.id, item));
