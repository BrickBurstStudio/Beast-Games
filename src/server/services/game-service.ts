import { OnStart, Service } from "@flamework/core";
import { MarketplaceService, Players } from "@rbxts/services";
import { FlagChallenge } from "server/challenges/flag-challenge";
import { ProductService } from "./product-service";

@Service()
export class GameService implements OnStart {
	onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();

		// new FlagChallenge().Start();
		task.wait(3);
		// ProductService.PromptPurchase(Players.GetPlayers()[0], "BecomeMrBeast");
	}
}
