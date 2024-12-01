import { CommandContext } from "@rbxts/cmdr";
import { store } from "server/store";

export = function (context: CommandContext, player: Player, amount: number) {
	store.addActionTokens(tostring(player.UserId), amount);

	return `Gave ${player.Name} ${amount} tokens.`;
};
