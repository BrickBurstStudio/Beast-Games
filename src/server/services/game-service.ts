import { OnStart, Service } from "@flamework/core";
import { MarketplaceService, Players } from "@rbxts/services";
import { FlagChallenge } from "server/challenges/flag-challenge";
import { ProductService } from "./product-service";
import { BriefcaseChallenge } from "server/challenges/briefcase-challenge";
import { announceAndWait } from "server/util/announceAndWait";

@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		// await new BriefcaseChallenge().Start();
	}
}
