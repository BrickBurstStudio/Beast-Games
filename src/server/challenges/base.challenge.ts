import { Janitor } from "@rbxts/janitor";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { Players, Workspace } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Events } from "server/network";
import { announce } from "server/util/announce";
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
	protected players: Player[] = [];
	static round = 0;

	public async Start() {
		BaseChallenge.round++;

		this.players = Players.GetPlayers().filter((player) => !player.GetAttribute("eliminated"));

		this.obliterator.Add(this.map, "Destroy");
		this.map.Parent = Workspace;
		task.wait(this.mapLoadingTime);

		await Promise.all(
			this.players.map(async (player, i) => {
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
			rules: [
				"You will be assigned a random team.",
				"You must work with your team to pull the boulder to the finish line.",
				"The last team to cross the finish line will be eliminated!",
			],
		});

		Events.announcer.countdown.broadcast({ seconds: 3, description: "Get Ready!" });

		await Promise.all(
			this.players.map(async (player) => {
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
		this.players.remove(this.players.findIndex((p) => p === player));
		task.wait(1);
		player.SetAttribute("eliminated", true);
	}

	private async RewardPlayers() {
		await Promise.all(
			this.players.map(async (player) => {
				const cashReward = calculateReward(BaseChallenge.round, 10_000, 1.1);
				const xpReward = calculateReward(BaseChallenge.round, 10, 1.1);

				const orderedPlayerData = new OrderedPlayerData(player);
				orderedPlayerData.cash.UpdateBy(cashReward);
				orderedPlayerData.xp.UpdateBy(xpReward);
			}),
		);
	}
}
