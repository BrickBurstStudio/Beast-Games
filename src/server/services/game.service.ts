import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { FlagChallenge } from "server/challenges/flag.challenge";
import { MoneyPileChallenge } from "server/challenges/money-pile.challenge";
import { ProductService } from "./product.service";
import { Events } from "server/network";
import { ExampleGizmo } from "server/classes/gizmos/ExampleGizmo";
import { Gizmo } from "server/classes/Gizmo";

@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(2);

		Gizmo.give(Players.GetPlayers()[0], ExampleGizmo);
	}
}
