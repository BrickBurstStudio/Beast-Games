import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "openCase",
	Aliases: ["oC"],
	Description: "Open a case in your inventory",
	Group: "Admin",
	Args: [
		{
			Type: "case",
			Name: "Case",
			Description: "Case",
		},
	],
});
