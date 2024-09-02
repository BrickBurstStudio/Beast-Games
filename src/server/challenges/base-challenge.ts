import { Components } from "@flamework/components";
import { Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { getCharacter } from "shared/utils/functions/getCharacter";

export default abstract class BaseChallenge {
	finished = false;

	protected abstract Main(): void;

	protected async EliminatePlayer(player: Player) {
		if (!Players.GetChildren().includes(player)) return;
		if (!player.Character) return;
		const character = await getCharacter(player);
		character.Humanoid.Health = 0;
	}

	public Start() {
		this.Main();
		while (!this.finished) task.wait();
	}
}
