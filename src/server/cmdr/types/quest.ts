import { Registry } from "@rbxts/cmdr";
import { quests } from "shared/configs/quests";

export = function (registry: Registry) {
	registry.RegisterType(
		"quest",
		registry.Cmdr.Util.MakeEnumType(
			"quest",
			quests.map((c) => c.id),
		),
	);
};
