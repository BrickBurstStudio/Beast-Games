import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { store } from "server/store";
import { selectPlayerData } from "shared/store/selectors/players";

@Service()
export class QuestService implements OnStart {
	onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();

		const player = Players.GetPlayers()[0];
		store.once(selectPlayerData(tostring(player.UserId)), (state) => {
			const x = store.addQuest(tostring(player.UserId), "quest_1");
			// store.incrementTarget(tostring(player.UserId), "quest_1");
			store.changeXP(tostring(player.UserId), 300);
			print(state.quests, state.xp);
		});
	}
}
