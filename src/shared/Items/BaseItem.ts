import { Currency } from "shared/configs/Currency";
import { ItemRarity } from "shared/configs/items";

export type ItemConstructorArgs = {
	id: string;
	currency: Currency;
	rarity: ItemRarity;
	stackable: boolean;
};

export default abstract class BaseItem {
	public readonly id: ItemConstructorArgs["id"];
	public readonly rarity: ItemConstructorArgs["rarity"];
	public readonly currency: ItemConstructorArgs["currency"];
	public readonly stackable: ItemConstructorArgs["stackable"];

	constructor(args: ItemConstructorArgs) {
		this.id = args.id;
		this.currency = args.currency;
		this.rarity = args.rarity;
		this.stackable = args.stackable;
	}

	abstract Equip(player: Player): Promise<void>;
}
