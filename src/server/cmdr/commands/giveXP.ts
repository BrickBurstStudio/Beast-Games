import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "giveXP",
	Aliases: ["gX"],
	Description: "Increase the player's level",
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
			Description: "XP fr",
		},
	],
});
