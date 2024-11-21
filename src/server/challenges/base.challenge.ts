import { Janitor } from "@rbxts/janitor";
import Make from "@rbxts/make";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { CollectionService, Players, Workspace } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Events } from "server/network";
import { announce } from "server/util/announce";
import { countdown } from "server/util/countdown";
import { calculateReward } from "shared/utils/functions/calculateReward";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";

export type SpawnCharacterArgs = {
	player: Player;
	character: CharacterRigR6;
	i: number;
};

export abstract class BaseChallenge {
	private readonly socialPeriodDuration = 30;
	private readonly mapLoadingTime = 2;
	protected readonly obliterator = new Janitor();
	protected abstract readonly map: Folder;
	protected abstract readonly challengeName: string;
	protected abstract readonly rules: string[];
	protected playersInChallenge: Player[] = [];
	protected floor = true;
	protected contestantDiedOrLeft = new Instance("BindableEvent");
	static round = 0;

	public async Start() {
		BaseChallenge.round++;

		this.ToggleFloor(this.floor);

		this.playersInChallenge = Players.GetPlayers().filter((player) => !player.GetAttribute("eliminated"));

		this.obliterator.Add(this.map, "Destroy");
		this.map.Parent = Workspace;
		task.wait(this.mapLoadingTime);

		await Promise.all(
			this.playersInChallenge.map(async (player, i) => {
				player.CharacterAdded.Connect(async () => {
					const character = await getCharacter(player);
					character.Humanoid.Died.Connect(() => this.contestantDiedOrLeft.Fire(player));
				});
				const conn = Players.PlayerRemoving.Connect((player) => {
					this.contestantDiedOrLeft.Fire(player);
					conn.Disconnect();
				});
				this.obliterator.Add(conn, "Disconnect");

				player.LoadCharacter();
				const character = await getCharacter(player);
				character.Humanoid.WalkSpeed = 0;
				this.SpawnCharacter({ player, character, i });
			}),
		);

		await this.ExplainRulesAndStart();

		await this.Main();
		Events.announcer.announce.broadcast(["The challenge is over!"]);
		await this.RewardPlayers();

		// task.wait(this.socialPeriodDuration);
		this.obliterator.Cleanup();
	}

	protected abstract Main(): Promise<void>;

	protected abstract SpawnCharacter({ player, character, i }: SpawnCharacterArgs): void;

	protected async ExplainRulesAndStart() {
		Events.announcer.announceRules.broadcast({
			challengeName: this.challengeName,
			rules: this.rules,
		});

		task.wait(10);
		await countdown({ seconds: 3, description: "Get Ready!" });

		await Promise.all(
			this.playersInChallenge.map(async (player) => {
				const character = await getCharacter(player);
				character.Humanoid.WalkSpeed = 16;
			}),
		);
	}

	protected async EliminatePlayer(player: Player) {
		if (!Players.GetChildren().includes(player)) return;
		if (!player.Character) return;
		const character = await getCharacter(player);
		character.Humanoid.Health = 0;
		this.playersInChallenge.remove(this.playersInChallenge.findIndex((p) => p === player));
		task.wait(1);
		player.SetAttribute("eliminated", true);
	}

	protected ToggleFloor(value: boolean) {
		CollectionService.GetTagged("stadium-floor").forEach((floor) => {
			if (!floor.IsA("BasePart")) return;
			floor.Transparency = value ? 0 : 1;
			floor.CanCollide = value;
		});
	}

	private async RewardPlayers() {
		await Promise.all(
			this.playersInChallenge.map(async (player) => {
				const cashReward = calculateReward(BaseChallenge.round, 10_000, 1.1);
				const xpReward = calculateReward(BaseChallenge.round, 10, 1.1);

				const orderedPlayerData = new OrderedPlayerData(player);
				orderedPlayerData.cash.UpdateBy(cashReward);
				orderedPlayerData.xp.UpdateBy(xpReward);
			}),
		);
	}
}
