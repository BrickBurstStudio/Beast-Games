import { Currency } from "shared/configs/Currency";
import BaseItem, { ItemConstructorArgs } from "./BaseItem";

export type CaseConstructorArgs = { price: number; type: "pet" | "emote" | "cosmetic"; items: string[] };

export class Case extends BaseItem {
	public readonly price: number;
	public readonly items: string[];

	constructor(args: ItemConstructorArgs & CaseConstructorArgs) {
		super(args);
		this.price = args.price;
		this.items = args.items;
	}
}
