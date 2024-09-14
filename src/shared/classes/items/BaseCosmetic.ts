import BaseItem, { ItemConstructorArgs } from "./BaseItem";

export abstract class BaseCosmetic extends BaseItem {
	constructor(args: ItemConstructorArgs) {
		super(args);
	}
}
