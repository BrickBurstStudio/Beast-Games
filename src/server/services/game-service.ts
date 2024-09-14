import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { store } from "server/store";

@Service()
class GameService implements OnStart {
	onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		// new BriefcaseChallenge().Start();
	}
}
