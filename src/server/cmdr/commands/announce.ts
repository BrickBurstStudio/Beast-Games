import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "announce",
	Aliases: ["announce"],
	Description: "Send announcement to all clients.",
	Group: "Admin",
	Args: [
		{
			Type: "strings",
			Name: "Message",
			Description: "Message",
		},
	],
});
