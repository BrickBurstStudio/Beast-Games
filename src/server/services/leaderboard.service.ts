import { OnStart, Service } from "@flamework/core";
import { BaseOrderedDataStore } from "server/classes/BaseOrderedDataStore";

import { Events } from "server/network";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

@Service({})
export class LeaderboardService implements OnStart {
	onStart() {
		const xp = BaseOrderedDataStore.GetTop(100, "xp");
		const playTime = BaseOrderedDataStore.GetTop(100, "playTime");
		const wins = BaseOrderedDataStore.GetTop(100, "wins");

		const cash = BaseOrderedDataStore.GetTop(100, "cash");

		//! Uncomment to reset leaderboards
		// BaseOrderedDataStore.Reset("xp");
		// BaseOrderedDataStore.Reset("playTime");
		// BaseOrderedDataStore.Reset("wins");
		// BaseOrderedDataStore.Reset("cash");

		forEveryPlayer((player) => {
			player.CharacterAdded.Connect(() => {
				Events.updateLeaderboards.fire(player, {
					xp,
					playTime,
					wins,
					cash,
				});
			});
		});

		while (true) {
			const xp = BaseOrderedDataStore.GetTop(100, "xp");
			const playTime = BaseOrderedDataStore.GetTop(100, "playTime");
			const wins = BaseOrderedDataStore.GetTop(100, "wins");

			const cash = BaseOrderedDataStore.GetTop(100, "cash");
			Events.updateLeaderboards.broadcast({
				xp,
				playTime,
				wins,
				cash,
			});
			task.wait(60);
		}
	}
}
