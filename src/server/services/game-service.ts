import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { store } from "server/store";
import { createDare } from "server/util/createDare";
import { selectPlayerQuests } from "shared/store/selectors/players";

@Service()
export class GameService implements OnStart {
	onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		// new BriefcaseChallenge().Start();

		const player = Players.GetPlayers()[0];

		const completeTarget = createDare(
			{
				name: "",
				description: "",
				reward: "cash",
				targets: 1,
			},
			(player) => {},
		);
		completeTarget(player);
	}
}
