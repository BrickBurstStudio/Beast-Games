import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "announce",
	Aliases: ["announce"],
	Description: "Send announcement to all clients.",
	Group: "Admin",
	Args: [
		{
			Type: "string",
			Name: "Message",
			Description: "Message",
		},
	],
});
