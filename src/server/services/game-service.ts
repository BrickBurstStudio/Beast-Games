import { OnStart, Service } from "@flamework/core";
import { MarketplaceService, Players } from "@rbxts/services";
import { FlagChallenge } from "server/challenges/flag-challenge";
import { ProductService } from "./product-service";
import { BriefcaseChallenge } from "server/challenges/briefcase-challenge";
import { announceAndWait } from "server/util/waitForAnnouncements";

@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		// await new BriefcaseChallenge().Start();

		announceAndWait([
			"Hi there my little chupicabras.",
			"I hope my chupicabras are doing quite well today.",
			"are my delectable chupicabras preapred to be harvested for my meal today?",
		]);
		print("finished waiting");
	}
}
