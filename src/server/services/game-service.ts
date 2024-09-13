import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";

@Service()
class GameService implements OnStart {
	onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		// new BriefcaseChallenge().Start();

		const player = Players.GetPlayers()[0];
	}
}
