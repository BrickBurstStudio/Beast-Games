import { Registry } from "@rbxts/cmdr";
import { cases } from "shared/configs/items/cases";

export = function (registry: Registry) {
	registry.RegisterType(
		"case",
		registry.Cmdr.Util.MakeEnumType(
			"case",
			cases.map((c) => c.id),
		),
	);
};
