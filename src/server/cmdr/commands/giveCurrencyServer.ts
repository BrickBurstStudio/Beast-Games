import { CommandContext } from "@rbxts/cmdr";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { store } from "server/store";
import { Currency } from "shared/configs/currency";

export = function (context: CommandContext, player: Player, currency: Currency, amount: number) {
	if (currency === "action_tokens") {
		store.changeBalance(tostring(player.UserId), currency, amount);
	} else {
		const orderedPlayerData = new OrderedPlayerData(player);
		orderedPlayerData[currency].UpdateBy(amount);
	}

	return `Gave ${player.Name} ${amount} ${currency}.`;
};
