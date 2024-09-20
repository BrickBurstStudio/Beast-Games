import { Janitor } from "@rbxts/janitor";
import { Players, Workspace } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Events } from "server/network";
import { calculateReward } from "shared/utils/functions/calculateReward";
import { getCharacter } from "shared/utils/functions/getCharacter";

export abstract class BaseChallenge {
	private readonly socialPeriodDuration = 30;
	private readonly mapLoadingTime = 2;
	protected readonly obliterator = new Janitor();
	protected abstract readonly map: Folder;
	protected abstract readonly announcements: string[];
	protected players: Player[] = [];
	static round = 0;

	public async Start() {
		BaseChallenge.round++;
		const players = Players.GetPlayers();

		this.obliterator.Add(this.map, "Destroy");
		this.map.Parent = Workspace;
		task.wait(this.mapLoadingTime);

		this.SpawnPlayers(players);
		this.players = players;
		Events.announcer.announce.broadcast(this.announcements);

		await this.Main();
		await this.RewardPlayers();

		task.wait(this.socialPeriodDuration);
		this.obliterator.Cleanup();
	}

	protected abstract Main(): Promise<void>;

	protected abstract SpawnPlayers(players: Player[]): void;

	protected async EliminatePlayer(player: Player) {
		if (!Players.GetChildren().includes(player)) return;
		if (!player.Character) return;
		const character = await getCharacter(player);
		character.Humanoid.Health = 0;
	}

	private async RewardPlayers() {
		await Promise.all(
			this.players.map(async (player) => {
				const cashReward = calculateReward(BaseChallenge.round, 10_000, 1.1);
				const gemReward = calculateReward(BaseChallenge.round, 1, 1.1);
				const xpReward = calculateReward(BaseChallenge.round, 10, 1.1);

				const orderedPlayerData = new OrderedPlayerData(player);
				orderedPlayerData.cash.UpdateBy(cashReward);
				orderedPlayerData.gems.UpdateBy(gemReward);
				orderedPlayerData.xp.UpdateBy(xpReward);
			}),
		);
	}
}
