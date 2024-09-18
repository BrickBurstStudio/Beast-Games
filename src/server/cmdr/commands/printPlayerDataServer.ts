import { CommandContext } from "@rbxts/cmdr";
import { Functions } from "server/network";
import { store } from "server/store";
import { cases } from "shared/configs/items/cases";
import { selectPlayerData } from "shared/store/selectors/players";
import { defaultPlayerData } from "shared/store/slices/players/utils";

export = function (context: CommandContext, player: Player, playerData: string) {
	print(store.getState(selectPlayerData(tostring(player.UserId)))[playerData as keyof typeof defaultPlayerData]);
};
