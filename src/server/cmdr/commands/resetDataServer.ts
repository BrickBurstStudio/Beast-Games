import { CommandContext } from "@rbxts/cmdr";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { store } from "server/store";

export = function (context: CommandContext, player: Player) {
	const orderedPlayerData = new OrderedPlayerData(player);
	orderedPlayerData.cash.UpdateBy(-orderedPlayerData.cash.Get());
	orderedPlayerData.gems.UpdateBy(-orderedPlayerData.gems.Get());
	orderedPlayerData.honor.UpdateBy(-orderedPlayerData.honor.Get());
	orderedPlayerData.wins.UpdateBy(-orderedPlayerData.wins.Get());
	orderedPlayerData.xp.UpdateBy(-orderedPlayerData.xp.Get());
	orderedPlayerData.playTime.UpdateBy(-orderedPlayerData.playTime.Get());
  
	store.reset(tostring(player.UserId));

	return `Reset ${player.Name}'s data.`;
};
