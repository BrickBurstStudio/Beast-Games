import { OnStart, Service } from "@flamework/core";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";
import { setTimeout } from "@rbxts/set-timeout";
import { BoulderChallenge } from "server/challenges/boulder.challenge";
import { BriefcaseChallenge } from "server/challenges/briefcase.challenge";
import { GoldRushChallenge } from "server/challenges/gold-rush.challenge";
import { Events } from "server/network";
import { MAIN_PLACE_ID } from "shared/configs/places";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Service()
export class MainService implements OnStart {
	public static DESTROY_CHARACTER_DELAY = 3;
	private static EXPECTED_PLAYERS_DEFAULT = 1;
	private static JOIN_TIMEOUT = 20;

	private playersJoined = 0;
	private expectedPlayers = MainService.EXPECTED_PLAYERS_DEFAULT;
	private joinTimedOut = false;

	async onStart() {
		if (game.PlaceId !== MAIN_PLACE_ID) return;
		this.setupReset();
		this.setupDestroyCharacterOnDeath();
		this.yieldPlayers();

		for (const challenge of [BoulderChallenge]) {
			await new challenge().Start();
		}
	}

	yieldPlayers() {
		Players.PlayerAdded.Connect((player) => {
			this.playersJoined++;
			this.expectedPlayers = player.GetJoinData().Members?.size() ?? MainService.EXPECTED_PLAYERS_DEFAULT;
		});
		setTimeout(() => {
			this.joinTimedOut = true;
		}, MainService.JOIN_TIMEOUT);

		while (this.playersJoined < this.expectedPlayers && !this.joinTimedOut) task.wait();
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
