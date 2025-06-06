import { Janitor } from "@rbxts/janitor";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { AnalyticsService, CollectionService, Players, Workspace } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Events } from "server/network";
import { store } from "server/store";
import { announceRules } from "server/util/announceRules";
import { cancelCountdown, countdown } from "server/util/countdown";
import { ChallengeName } from "shared/configs/gui";
import { selectPlayerData } from "shared/store/selectors/players";
import { calculateReward } from "shared/utils/functions/calculateReward";
import { getCharacter } from "shared/utils/functions/getCharacter";

export type SpawnCharacterArgs = {
	player: Player;
	character: CharacterRigR6;
	i: number;
};

export abstract class BaseChallenge {
	protected readonly obliterator = new Janitor();
	protected abstract readonly map: Folder;
	protected abstract readonly challengeName: ChallengeName;
	protected abstract readonly rules: string[];
	protected playersInChallenge: Player[] = [];
	protected floor = true;
	protected contestantDiedOrLeft = new Instance("BindableEvent");
	protected challengeDuration = 0;
	static round = 0;

	/* ---------------------------- Lifecycle Methods ---------------------------- */

	public async start() {
		store.setChallenge(this.challengeName);
		await this.initializeRound();
		await this.setupMap();
		this.assignPlayers();

		while (!(await this.isSetupCompleted())) task.wait(0.5);
		await this.setup();
		await this.spawnPlayers();

		Events.animations.setBlackFade.broadcast(false);
		await this.doUISequence();

		await this.enablePlayerMovement();

		if (this.challengeDuration > 0) {
			await Promise.race([
				this.main(),
				new Promise(async (resolve) => {
					this.startChallengeTimer();
					task.wait(this.challengeDuration);
					await this.onTimerExpired();
					resolve(undefined);
				}),
			]);
		} else {
			await this.main();
		}

		cancelCountdown();
		await this.rewardPlayers();
		store.setChallenge(undefined);
		task.wait(5);

		Events.animations.setBlackFade.broadcast(true);

		this.freezePlayers();
		this.obliterator.Cleanup();
	}

	private startChallengeTimer() {
		countdown({ seconds: this.challengeDuration });
	}

	/**
	 * Called when the challenge timer expires.
	 * Override this method in child classes to handle timer expiration.
	 */
	protected async onTimerExpired(): Promise<void> {}

	protected abstract main(): Promise<any>;

	protected abstract spawnCharacter({ player, character, i }: SpawnCharacterArgs): void;
	protected async setup() {}
	protected async isSetupCompleted(): Promise<boolean> {
		return true;
	}

	/* ---------------------------- Player Management --------------------------- */

	private freezePlayers() {
		this.playersInChallenge.forEach(async (player) => {
			const character = await getCharacter(player);
			character.HumanoidRootPart.Anchored = true;
		});
	}

	private assignPlayers() {
		this.playersInChallenge = Players.GetPlayers().filter((player) => {
			const lives = player.GetAttribute("lives") as number;
			return lives > 0;
		});
	}

	private async spawnPlayers() {
		await Promise.all(
			this.playersInChallenge.map(async (player, i) => {
				this.setupPlayerEvents(player);
				player.LoadCharacter();
				const character = await getCharacter(player);
				character.Humanoid.WalkSpeed = 0;
				character.Humanoid.JumpPower = 0;
				this.spawnCharacter({ player, character, i });
			}),
		);
	}

	private setupPlayerEvents(player: Player) {
		const playerOut = () => {
			const lives = player.GetAttribute("lives") as number;
			player.SetAttribute("lives", lives - 1);
			this.playersInChallenge.remove(this.playersInChallenge.findIndex((p) => p === player));
			this.contestantDiedOrLeft.Fire(player);
		};

		const charConn = player.CharacterAdded.Connect(async () => {
			const character = await getCharacter(player);
			const bruhConn = character.Humanoid.Died.Connect(() => {
				bruhConn.Disconnect();
				charConn.Disconnect();
				playerOut();
			});
			this.obliterator.Add(bruhConn, "Disconnect");
			this.obliterator.Add(charConn, "Disconnect");
		});

		const conn = Players.PlayerRemoving.Connect((player) => {
			playerOut();
			conn.Disconnect();
		});
		this.obliterator.Add(conn, "Disconnect");
	}

	/* ------------------------------ Map Control ----------------------------- */

	private async setupMap() {
		this.toggleFloor(this.floor);
		this.obliterator.Add(this.map, "Destroy");
		this.map.Parent = Workspace;
	}

	protected toggleFloor(value: boolean) {
		CollectionService.GetTagged("stadium-floor").forEach((floor) => {
			if (!floor.IsA("BasePart")) return;
			floor.Transparency = value ? 0 : 1;
			floor.CanCollide = value;
		});
	}

	/* ---------------------------- Round Management --------------------------- */

	private async initializeRound() {
		BaseChallenge.round++;

		Players.GetPlayers().forEach((player) => {
			AnalyticsService.LogFunnelStepEvent(
				player,
				"Core Loop",
				`${player.UserId}-${game.JobId}`,
				BaseChallenge.round + 4,
				`challenge-${BaseChallenge.round}`,
				{
					[Enum.AnalyticsCustomFieldKeys.CustomField01.Name]: this.challengeName,
					[Enum.AnalyticsCustomFieldKeys.CustomField02.Name]:
						player.GetAttribute("lives") === 0 ? true : false,
				},
			);
			AnalyticsService.LogOnboardingFunnelStepEvent(
				player,
				BaseChallenge.round + 4,
				`challenge-${BaseChallenge.round}`,
				{
					[Enum.AnalyticsCustomFieldKeys.CustomField01.Name]: this.challengeName,
					[Enum.AnalyticsCustomFieldKeys.CustomField02.Name]:
						player.GetAttribute("lives") === 0 ? true : false,
				},
			);
		});
	}

	protected async doUISequence() {
		await announceRules({
			challengeName: this.challengeName,
			rules: this.rules,
		});
	}

	protected async enablePlayerMovement() {
		return Promise.all(
			this.playersInChallenge.map(async (player) => {
				const character = await getCharacter(player);
				character.Humanoid.WalkSpeed = 16;
				character.Humanoid.JumpPower = 50;
			}),
		);
	}

	private async rewardPlayers() {
		await Promise.all(
			this.playersInChallenge.map(async (player) => {
				const cashReward = calculateReward(BaseChallenge.round, 10_000, 1.5);
				const xpReward = calculateReward(BaseChallenge.round, 10, 1.1);

				const orderedPlayerData = new OrderedPlayerData(player);
				orderedPlayerData.cash.UpdateBy(cashReward);
				const playerData = store.getState(selectPlayerData(tostring(player.UserId)));
				AnalyticsService.LogEconomyEvent(
					player,
					Enum.AnalyticsEconomyFlowType.Source,
					"cash",
					cashReward,
					playerData.balance.cash,
					Enum.AnalyticsEconomyTransactionType.Gameplay.Name,
				);
				orderedPlayerData.xp.UpdateBy(xpReward);
			}),
		);
	}
}
