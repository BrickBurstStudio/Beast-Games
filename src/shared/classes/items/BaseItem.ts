import { Currency } from "shared/configs/Currency";
import { ItemRarity } from "shared/configs/items";

export type ItemConstructorArgs = {
	id: string;
	rarity: ItemRarity;
	name: string;
};

export default abstract class BaseItem {
	public readonly id: ItemConstructorArgs["id"];
	public readonly rarity: ItemConstructorArgs["rarity"];
	public readonly name: ItemConstructorArgs["name"];

	public readonly instanceId: string | undefined;

	constructor(args: ItemConstructorArgs) {
		this.id = args.id;
		this.rarity = args.rarity;
		this.name = args.name;
	}
}
