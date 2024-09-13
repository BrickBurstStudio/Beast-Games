import { CommandContext } from "@rbxts/cmdr";
import { OrderedPlayerData } from "server/OrderedPlayerData";
import { Currency } from "shared/configs/Currency";

export = function (context: CommandContext, player: Player, currency: Currency, amount: number) {
	const orderedPlayerData = new OrderedPlayerData(player);
	orderedPlayerData[currency].UpdateBy(amount);
};
