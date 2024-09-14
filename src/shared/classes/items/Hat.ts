import { Workspace } from "@rbxts/services";
import { BaseCosmetic } from "./BaseCosmetic";
import BaseItem, { ItemConstructorArgs } from "./BaseItem";
import Make from "@rbxts/make";

type HatConstructorArgs = {
	meshId: SpecialMesh["MeshId"];
};

export class Hat extends BaseCosmetic {
	public readonly meshId: HatConstructorArgs["meshId"];

	constructor(args: ItemConstructorArgs & HatConstructorArgs) {
		super(args);
		this.meshId = args.meshId;
	}
}
