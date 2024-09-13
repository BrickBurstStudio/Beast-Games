import { Components } from "@flamework/components";
import { Service } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import Make from "@rbxts/make";
import { Players, ServerStorage, Workspace } from "@rbxts/services";
import { getCharacter } from "shared/utils/functions/getCharacter";

export abstract class BaseChallenge {
	private finished = false;
	protected readonly obliterator = new Janitor();
	protected abstract readonly map: Folder;

	public Start() {
		this.obliterator.Add(this.map, "Destroy");
		this.map.Parent = Workspace;
		this.Main();
		while (!this.finished) task.wait();
		this.obliterator.Cleanup();
	}

	protected abstract Main(): void;

	protected async EliminatePlayer(player: Player) {
		if (!Players.GetChildren().includes(player)) return;
		if (!player.Character) return;
		const character = await getCharacter(player);
		character.Humanoid.Health = 0;
	}
}
