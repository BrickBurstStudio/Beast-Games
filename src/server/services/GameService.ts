import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import BoulderPull from "server/challenges/boulder-pull";
import CaseRace from "server/challenges/case-race";

@Service()
class GameService implements OnStart {
	onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();

		// new BoulderPull().Start();
		new CaseRace().Start();
	}
}
