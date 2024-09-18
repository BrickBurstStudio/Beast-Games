import { Registry } from "@rbxts/cmdr";
import Object from "@rbxts/object-utils";
import { defaultPlayerData } from "shared/store/slices/players/utils";

export = function (registry: Registry) {
	registry.RegisterType("playerData", registry.Cmdr.Util.MakeEnumType("playerData", Object.keys(defaultPlayerData)));
};
