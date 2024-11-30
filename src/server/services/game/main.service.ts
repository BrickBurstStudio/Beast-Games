import { OnStart, Service } from "@flamework/core";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { AnalyticsService, Players } from "@rbxts/services";
import { setTimeout } from "@rbxts/set-timeout";
import { BoulderChallenge } from "server/challenges/boulder.challenge";
import { BribeChallenge } from "server/challenges/bribe.challenge";
import { BriefcaseChallenge } from "server/challenges/briefcase.challenge";
import { FlagChallenge } from "server/challenges/flag.challenge";
import { GoldRushChallenge } from "server/challenges/gold-rush.challenge";
import { KingOfHillChallenge } from "server/challenges/king-of-hill.challenge";
import { PugilChallenge } from "server/challenges/pugil.challenge";
import { SplitOrStealChallenge } from "server/challenges/split-or-steal.challenge";
import { TowerChallenge } from "server/challenges/tower.challenge";
import { Events } from "server/network";
import { MAIN_PLACE_ID } from "shared/configs/places";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Service()
export class GameMainService implements OnStart {
	/* ------------------------------ Configurables ----------------------------- */
	public static DESTROY_CHARACTER_DELAY = 3;
	private static EXPECTED_PLAYERS_DEFAULT = 2;
	private static JOIN_TIMEOUT = 20;

	/* ---------------------------------- Class --------------------------------- */
	private playersJoined = 0;
	private expectedPlayers = GameMainService.EXPECTED_PLAYERS_DEFAULT;
	private joinTimedOut = false;

	/* ------------------------------- Life Cycle ------------------------------- */
	async onStart() {
		if (game.PlaceId !== MAIN_PLACE_ID) return;
		this.setupReset();
		this.setupDestroyCharacterOnDeath();
		this.yieldPlayers();

		await new BribeChallenge().start();

		// const availableChallenges = [
		// 	GoldRushChallenge,
		// 	PugilChallenge,
		// 	BoulderChallenge,
		// 	TowerChallenge,
		// 	FlagChallenge,
		// 	BriefcaseChallenge,
		// ];

		// const shuffledChallenges = availableChallenges
		// 	.map((value) => ({ value, sort: math.random() }))
		// 	.sort((a, b) => a.sort - b.sort > 0)
		// 	.map(({ value }) => value);

		// for (const Challenge of shuffledChallenges) {
		// 	await new Challenge().start();
		// }

		await new KingOfHillChallenge().start();
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
			this.expectedPlayers = player.GetJoinData().Members?.size() ?? GameMainService.EXPECTED_PLAYERS_DEFAULT;
		});
		setTimeout(() => {
			this.joinTimedOut = true;
		}, GameMainService.JOIN_TIMEOUT);

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
			const connections = new Array<RBXScriptConnection>();
			
			const handleCharacter = (character: CharacterRigR6) => {
				connections.push(
					character.Humanoid.Died.Connect(() => {
						task.wait(GameMainService.DESTROY_CHARACTER_DELAY);
						character.Destroy();
					})
				);
			};

			if (player.Character) handleCharacter(await getCharacter(player));
			connections.push(
				player.CharacterAdded.Connect(async (char) => handleCharacter(await getCharacter(player)))
			);

			return () => connections.forEach(c => c.Disconnect());
		});
	}
}
