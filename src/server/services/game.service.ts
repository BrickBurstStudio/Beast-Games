import { OnStart, Service } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { BoulderChallenge } from "server/challenges/boulder.challenge";


@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(2);
		await new BoulderChallenge().Start();
	}
}
