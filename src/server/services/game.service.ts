import { OnInit, OnStart, Service } from "@flamework/core";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { Players, StarterGui } from "@rbxts/services";
import { PugilChallenge } from "server/challenges/pugil.challenge";
import { Gizmo } from "server/classes/Gizmo";
import { Pugil } from "server/classes/gizmos/Pugil";
import { Events } from "server/network";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Service()
export class GameService implements OnStart {
	public static DESTROY_CHARACTER_DELAY = 3;

	async onStart() {
		this.setupReset();
		this.setupDestroyCharacterOnDeath();

		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(2);

		new PugilChallenge().Start();
		new PugilChallenge().Start();
	}

	setupReset() {
		Events.reset.connect(async (player) => {
			if (!player.Character) return;
			const character = await getCharacter(player);
			character.Humanoid.Health = 0;
		});
	}

	setupDestroyCharacterOnDeath() {
		forEveryPlayer((player) => {
			const func = (character: CharacterRigR6) => {
				(character.WaitForChild("Humanoid") as Humanoid).Died.Connect(() => {
					// task.wait(GameService.DESTROY_CHARACTER_DELAY);
					player.Character = undefined;
					character.Destroy();
				});
			};

			if (player.Character) func(player.Character as CharacterRigR6);

			player.CharacterAdded.Connect(async () => {
				const character = await getCharacter(player);
				character.Humanoid.Died.Connect(() => func(character));
			});
		});
	}
}
