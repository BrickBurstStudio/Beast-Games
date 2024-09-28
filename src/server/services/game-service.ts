import { OnStart, Service } from "@flamework/core";
import { MarketplaceService, Players } from "@rbxts/services";
import { ProductService } from "./product-service";
import { BriefcaseChallenge } from "server/challenges/briefcase-challenge";
import { announceAndWait } from "server/util/announceAndWait";
import { MoneyPileChallenge } from "server/challenges/money-pile-challenge";

@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		await new MoneyPileChallenge().Start();
	}
}
