import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { store } from "server/store";

@Service()
class GameService implements OnStart {
	onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		// new BriefcaseChallenge().Start();

		task.wait(3);
		const player = Players.GetPlayers()[0];
		store.equip(tostring(player.UserId), "hat_1");
	}
}
