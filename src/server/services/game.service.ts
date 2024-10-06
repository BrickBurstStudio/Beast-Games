import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { BriefcaseChallenge } from "server/challenges/briefcase.challenge";
import { FlagChallenge } from "server/challenges/flag.challenge";
import { MoneyPileChallenge } from "server/challenges/money-pile.challenge";

@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(3);
		// await new MoneyPileChallenge().Start();
		await new FlagChallenge().Start();
	}
}
