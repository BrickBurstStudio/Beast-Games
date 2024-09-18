import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "printPlayerData",
	Aliases: ["ppD"],
	Description: "Print player's data",
	Group: "Admin",
	Args: [
		{
			Type: "player",
			Name: "player",
			Description: "Player",
		},
		{
			Type: "playerData",
			Name: "PlayerData",
			Description: "PlayerData",
		},
	],
});
