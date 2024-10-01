import { OnStart, Service } from "@flamework/core";
import { MarketplaceService, Players } from "@rbxts/services";
import { ProductService } from "./product-service";
import { BriefcaseChallenge } from "server/challenges/briefcase-challenge";
import { announceAndWait } from "server/util/announceAndWait";
import { MoneyPileChallenge } from "server/challenges/money-pile-challenge";
import { Events } from "server/network";

@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		// await new MoneyPileChallenge().Start();
		task.wait(3);
		print("hoe as hoe");
		Events.announcer.countdown.broadcast({ description: "bitch ass cum shit", seconds: 10 });
	}
}
