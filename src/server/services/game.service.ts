import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { FlagChallenge } from "server/challenges/flag.challenge";
import { Events } from "server/network";

@Service()
export class GameService implements OnStart {
	async onStart() {

		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(2);

		Players.GetPlayers().map((player) => {
			player.SetAttribute("lives", 3);
		});
		Events.animations.startChallenge.broadcast();
		task.wait(3);
		Events.animations.endChallenge.broadcast();
		// await new FlagChallenge().Start();
	}
}
