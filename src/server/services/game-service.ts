import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { BoulderChallenge } from "server/challenges/boulder-challenge";
import { BriefcaseChallenge } from "server/challenges/briefcase-challenge";

@Service()
class GameService implements OnStart {
	onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		new BriefcaseChallenge().Start();
	}
}
