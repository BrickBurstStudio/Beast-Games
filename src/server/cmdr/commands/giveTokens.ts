import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "giveTokens",
	Aliases: ["gT"],
	Description: "Increase the Players Tokens",
	Group: "Admin",
	Args: [
		{
			Type: "player",
			Name: "player",
			Description: "Player",
		},
		{
			Type: "number",
			Name: "Amount",
			Description: "Amount",
		},
	],
});
