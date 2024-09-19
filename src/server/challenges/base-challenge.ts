import { Components } from "@flamework/components";
import { Service } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import Make from "@rbxts/make";
import { Players, ServerStorage, Workspace } from "@rbxts/services";
import { Events } from "server/network";
import { getCharacter } from "shared/utils/functions/getCharacter";

export abstract class BaseChallenge {
	private finished = false;
	private readonly socialPeriodDuration = 30;
	private readonly mapLoadingTime = 2;
	protected readonly obliterator = new Janitor();
	protected abstract readonly map: Folder;
	protected abstract readonly announcements: string[];

	public Start() {
		this.obliterator.Add(this.map, "Destroy");
		this.map.Parent = Workspace;
		task.wait(this.mapLoadingTime);
		this.SpawnPlayers(Players.GetPlayers());
		Events.announcer.announce.broadcast(this.announcements);
		this.Main();
		while (!this.finished) task.wait();
		task.wait(this.socialPeriodDuration);
		this.obliterator.Cleanup();
	}

	protected abstract Main(): void;

	protected abstract SpawnPlayers(players: Player[]): void;

	protected async EliminatePlayer(player: Player) {
		if (!Players.GetChildren().includes(player)) return;
		if (!player.Character) return;
		const character = await getCharacter(player);
		character.Humanoid.Health = 0;
	}
}
