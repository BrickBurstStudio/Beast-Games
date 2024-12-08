import { OnStart, Service } from "@flamework/core";
import { AnalyticsService } from "@rbxts/services";
import { Events } from "server/network";
import { store } from "server/store";
import { actions } from "shared/configs/actions";
import { selectPlayerBalance } from "shared/store/selectors/players";

@Service()
export class ActionsService implements OnStart {
	onStart() {
		Events.useAction.connect((fromPlayer, { actionName, toPlayer }) => {
			let actionTokens = store.getState(selectPlayerBalance(tostring(fromPlayer.UserId), "action_token"));
			if (actionTokens === undefined) throw error("Player tokens not found");

			const action = actions.find((a) => a.name === actionName);
			if (!action) throw error("Action not found");

			const challenge = store.getState().client.gui.challenge;
			if (challenge && action.blacklistedChallenges.includes(challenge as never))
				return warn("Action not allowed in current challenge");

			if (actionTokens < action.cost) return warn("Not enough action tokens");

			store.changeBalance(tostring(fromPlayer.UserId), "action_token", -action.cost);
			actionTokens -= action.cost;
			AnalyticsService.LogEconomyEvent(
				fromPlayer,
				Enum.AnalyticsEconomyFlowType.Sink,
				"action_token",
				action.cost,
				actionTokens,
				Enum.AnalyticsEconomyTransactionType.Gameplay.Name,
				action.name,
			);

			Events.announcer.chatMessage.broadcast(
				`[ACTION] ${fromPlayer.DisplayName} used ${action.name} on ${toPlayer.DisplayName}!`,
			);

			action.callback({ fromPlayer, toPlayer });
		});
	}
}
