import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { MoneyPileChallenge } from "server/challenges/money-pile.challenge";

@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(2);
		await new MoneyPileChallenge().Start();
	}
}
