import { OnStart, Service } from "@flamework/core";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { AnalyticsService, Players } from "@rbxts/services";
import { setTimeout } from "@rbxts/set-timeout";
import { SplitOrStealChallenge } from "server/challenges/split-or-steal.challenge";
import { TowerChallenge } from "server/challenges/tower.challenge";
import { Events } from "server/network";
import { MAIN_PLACE_ID } from "shared/configs/places";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Service()
export class MainService implements OnStart {
	/* ------------------------------ Configurables ----------------------------- */
	public static DESTROY_CHARACTER_DELAY = 3;
	private static EXPECTED_PLAYERS_DEFAULT = 2;
	private static JOIN_TIMEOUT = 20;

	/* ---------------------------------- Class --------------------------------- */
	private playersJoined = 0;
	private expectedPlayers = MainService.EXPECTED_PLAYERS_DEFAULT;
	private joinTimedOut = false;

	/* ------------------------------- Life Cycle ------------------------------- */
	async onStart() {
		if (game.PlaceId !== MAIN_PLACE_ID) return;
		this.setupReset();
		this.setupDestroyCharacterOnDeath();
		this.yieldPlayers();

		for (const challenge of [TowerChallenge]) {
			await new challenge().start();
		}
		await new SplitOrStealChallenge().start();
	}

	yieldPlayers() {
		Players.PlayerAdded.Connect((player) => {
			AnalyticsService.LogFunnelStepEvent(
				player,
				"core_loop",
				`${player.UserId}-${game.JobId}`,
				4,
				"joined_main_game",
			);
			AnalyticsService.LogOnboardingFunnelStepEvent(player, 4, "joined_main_game");

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
		forEveryPlayer(async (player) => {
			const func = (character: CharacterRigR6) => {
				character.Humanoid.Died.Connect(() => {
					task.wait(MainService.DESTROY_CHARACTER_DELAY);
					character.Destroy();
				});
			};

			if (player.Character) func(await getCharacter(player));
			player.CharacterAdded.Connect(async () => func(await getCharacter(player)));
		});
	}
}
