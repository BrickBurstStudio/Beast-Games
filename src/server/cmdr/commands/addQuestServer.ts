import { CommandContext } from "@rbxts/cmdr";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { store } from "server/store";
import { Currency } from "shared/configs/currency";
import { quests } from "shared/configs/quests";

export = function (context: CommandContext, player: Player, quest: (typeof quests)[number]["id"]) {
	store.addQuest(tostring(player.UserId), quest);

	return `Added ${quest} to ${player}`;
};
