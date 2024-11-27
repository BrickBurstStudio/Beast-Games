import { OnStart, Service } from "@flamework/core";
import { Events } from "server/network";
import { store } from "server/store";
import { deviousLicks, divine } from "shared/configs/action";
import { selectPlayerActions } from "shared/store/selectors/players";

@Service()
export class CaseService implements OnStart {
	onStart() {
		Events.useAction.connect((fromPlayer, { actionId, toPlayer }) => {
			const fromPlayerActions = store.getState(selectPlayerActions(tostring(fromPlayer.UserId)));
			if (!fromPlayerActions) throw error("Player actions not found");

			const action = [...divine, ...deviousLicks].find((a) => a.id === actionId);
			if (!action) throw error("Action not found");

			if (!fromPlayerActions.includes(actionId)) throw error("Player does not have action");

			store.removeActionTicket(tostring(fromPlayer.UserId), actionId);
			Events.announcer.announce.broadcast([
				`${fromPlayer.DisplayName} used ${action.name} on ${toPlayer.DisplayName}`,
			]);
			action.callback({ fromPlayer, toPlayer });
		});
	}
}
