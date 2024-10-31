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
		const gems = BaseOrderedDataStore.GetTop(100, "gems");

		//! Uncomment to reset leaderboards
		// BaseOrderedDataStore.Reset("xp");
		// BaseOrderedDataStore.Reset("playTime");
		// BaseOrderedDataStore.Reset("wins");
		// BaseOrderedDataStore.Reset("cash");
		// BaseOrderedDataStore.Reset("gems");

		forEveryPlayer((player) => {
			player.CharacterAdded.Connect(() => {
				Events.updateLeaderboards.fire(player, {
					xp,
					playTime,
					wins,
					cash,
					gems,
				});
			});
		});

		while (true) {
			const xp = BaseOrderedDataStore.GetTop(100, "xp");
			const playTime = BaseOrderedDataStore.GetTop(100, "playTime");
			const wins = BaseOrderedDataStore.GetTop(100, "wins");

			const cash = BaseOrderedDataStore.GetTop(100, "cash");
			const gems = BaseOrderedDataStore.GetTop(100, "gems");
			print("Updating leaderboards", cash);
			Events.updateLeaderboards.broadcast({
				xp,
				playTime,
				wins,
				cash,
				gems,
			});
			task.wait(60);
		}
	}
}
