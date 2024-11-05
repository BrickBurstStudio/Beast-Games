import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Gizmo } from "server/classes/Gizmo";
import { Pugil } from "server/classes/gizmos/Pugil";

@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(2);

		Gizmo.give(Players.GetPlayers()[0], Pugil);
	}
}
