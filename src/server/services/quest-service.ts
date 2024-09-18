import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "server/network";
import { store } from "server/store";
import { selectPlayerData, selectPlayerQuests } from "shared/store/selectors/players";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

@Service()
export class QuestService implements OnStart {
	onStart() {
		forEveryPlayer((player) => {
			return store.subscribe(selectPlayerQuests(tostring(player.UserId)), (current, previous) => {
				if (!current) return warn("No current quests...");
				if (!previous) return Events.quests.initQuests(player, current);

				// * added * //
				for (const [id, data] of pairs(current)) {
					if (!(id in previous)) {
						Events.quests.addQuest(player, id, data);
						return;
					}
				}

				// * removed * //
				for (const [id, data] of pairs(previous)) {
					if (!(id in current)) {
						Events.quests.removeQuest(player, id, data);
						return;
					}
				}

				// * incremented * //
				for (const [id, data] of pairs(current)) {
					if (data.targets !== previous[id]?.targets) {
						Events.quests.incrementTarget(player, id, data);
						return;
					}
				}
			});
		});
	}
}
