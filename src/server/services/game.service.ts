import { OnStart, Service } from "@flamework/core";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";
import { Gizmo } from "server/classes/Gizmo";
import { Pugil } from "server/classes/gizmos/Pugil";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

@Service()
export class GameService implements OnStart {
	public static DESTROY_CHARACTER_DELAY = 3;

	async onStart() {
		this.setupDestroyCharacterOnDeath();

		Players.PlayerAdded.Connect((player) => {
			player.LoadCharacter();
		});

		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(2);
		Gizmo.give(Players.GetPlayers()[0], Pugil);

		new PugilChallenge().Start();
	}

	setupDestroyCharacterOnDeath() {
		forEveryPlayer((player) => {
			const func = (character: CharacterRigR6) =>
				character.Humanoid.Died.Connect(() => {
					task.wait(GameService.DESTROY_CHARACTER_DELAY);
					player.Character = undefined;
					character.Destroy();
				});

			if (player.Character) func(player.Character as CharacterRigR6);

			player.CharacterAdded.Connect(() => {
				const character = player.Character as CharacterRigR6;
				character.Humanoid.Died.Connect(() => func(character));
			});
		});
	}
}
