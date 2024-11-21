import { OnInit, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { Players, RunService, StarterGui, TeleportService } from "@rbxts/services";
import { BoulderChallenge } from "server/challenges/boulder.challenge";
import { BriefcaseChallenge } from "server/challenges/briefcase.challenge";
import { GoldRushChallenge } from "server/challenges/gold-rush.challenge";
import { PugilChallenge } from "server/challenges/pugil.challenge";
import { Gizmo } from "server/classes/Gizmo";
import { Pugil } from "server/classes/gizmos/Pugil";
import { Events } from "server/network";
import { MAIN_PLACE_ID } from "shared/configs/places";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Service()
export class MainService implements OnStart {
	public static DESTROY_CHARACTER_DELAY = 3;
	private static EXPECTED_PLAYERS = 1;

	async onStart() {
		if (game.PlaceId !== MAIN_PLACE_ID) return;
		this.setupReset();
		this.setupDestroyCharacterOnDeath();

		if (RunService.IsStudio()) {
			while (Players.GetPlayers().size() < MainService.EXPECTED_PLAYERS) task.wait();
		} else {
			// todo: wait for all expected players to join
			// ? use teleport service networking info somehow
		}
		await new PugilChallenge().Start();
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
