import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "server/network";

@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(2);
		// await new FlagChallenge().Start();
		// ProductService.PromptPurchase(Players.GetPlayers()[0], 2320616747);
		// task.wait(8);
		// print("purchased");

		// Events.useAction.predict(Players.GetPlayers()[0], { actionId: 2320616747, toPlayer: Players.GetPlayers()[0] });
	}
}
