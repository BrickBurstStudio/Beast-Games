import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "purchaseCase",
	Aliases: ["pC"],
	Description: "Purchase a case",
	Group: "Admin",
	Args: [
		{
			Type: "case",
			Name: "Case",
			Description: "Case",
		},
	],
});
