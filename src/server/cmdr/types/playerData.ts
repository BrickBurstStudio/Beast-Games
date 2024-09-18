import { Registry } from "@rbxts/cmdr";
import { defaultPlayerData } from "shared/store/slices/players/utils";
import { objectKeys } from "shared/utils/functions/objectKeys";

export = function (registry: Registry) {
	registry.RegisterType("playerData", registry.Cmdr.Util.MakeEnumType("playerData", objectKeys(defaultPlayerData)));
};
