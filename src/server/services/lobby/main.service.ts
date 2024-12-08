import { OnStart, Service } from "@flamework/core";
import { AnalyticsService, Players } from "@rbxts/services";
import { LOBBY_PLACE_ID } from "shared/configs/places";

@Service()
export class LobbyMainService implements OnStart {
	onStart() {
		if (game.PlaceId !== LOBBY_PLACE_ID) return;

		Players.PlayerAdded.Connect((player) => {
			AnalyticsService.LogOnboardingFunnelStepEvent(player, 1, "joined_lobby");
			AnalyticsService.LogFunnelStepEvent(
				player,
				"Core Loop",
				`${player.UserId}-${game.JobId}`,
				1,
				"joined_lobby",
			);
		});
	}
}
