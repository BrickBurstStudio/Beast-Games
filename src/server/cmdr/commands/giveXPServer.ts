import { CommandContext } from "@rbxts/cmdr";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Currency } from "shared/configs/currency";

export = function (context: CommandContext, player: Player, amount: number) {
	const orderedPlayerData = new OrderedPlayerData(player);
	orderedPlayerData.xp.UpdateBy(amount);

	return `Gave ${player.Name} ${amount} XP.`;
};
