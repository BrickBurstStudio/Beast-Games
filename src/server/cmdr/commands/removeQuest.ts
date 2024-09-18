import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "removeQuest",
	Aliases: ["rQ"],
	Description: "Remove a quest to a player's data.",
	Group: "Admin",
	Args: [
		{
			Type: "player",
			Name: "player",
			Description: "Player",
		},
		{
			Type: "quest",
			Name: "Quest",
			Description: "Quest ID",
		},
	],
});
