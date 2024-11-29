import { OnStart, Service } from "@flamework/core";
import { Events } from "server/network";
import { store } from "server/store";
import { deviousLicks, divine } from "shared/configs/action";
import { selectPlayerActionTokens } from "shared/store/selectors/players";

@Service()
export class ActionsService implements OnStart {
	onStart() {
		Events.useAction.connect((fromPlayer, { actionName, toPlayer }) => {
			const playerTokens = store.getState(selectPlayerActionTokens(tostring(fromPlayer.UserId)));
			if (playerTokens === undefined) throw error("Player tokens not found");

			const action = [...divine, ...deviousLicks].find((a) => a.name === actionName);
			if (!action) throw error("Action not found");

			if (playerTokens < action.cost) throw error("Not enough action tokens");

			store.removeActionTokens(tostring(fromPlayer.UserId), action.cost);
			Events.announcer.announce.broadcast([
				`${fromPlayer.DisplayName} used ${action.name} on ${toPlayer.DisplayName}`,
			]);
			action.callback({ fromPlayer, toPlayer });
		});
	}
}
