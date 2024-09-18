import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "addQuest",
	Aliases: ["aQ"],
	Description: "Add a quest to a player's data.",
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
