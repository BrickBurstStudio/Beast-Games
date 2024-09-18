import { CommandContext } from "@rbxts/cmdr";
import { store } from "server/store";
import { quests } from "shared/configs/quests";

export = function (context: CommandContext, player: Player, quest: (typeof quests)[number]["id"]) {
	store.removeQuest(tostring(player.UserId), quest);

	return `Removed ${quest} to ${player}`;
};
