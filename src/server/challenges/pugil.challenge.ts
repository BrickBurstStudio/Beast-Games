import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";
import { ServerStorage } from "@rbxts/services";

export class PugilChallenge extends BaseChallenge {
	protected map = ServerStorage.ChallengeMaps.PugilChallenge.Clone();
	protected challengeName = "Knockoff Knockout";
	protected rules = ["Knockout opponents to win!"];

	protected floor = false;

	protected async Main(): Promise<void> {
		this.ToggleFloor(false);
		task.wait(5000);
	}
	protected SpawnCharacter({ character, i }: SpawnCharacterArgs): void {
		const spawns = this.map.Spawns.GetChildren();
		const spawn = spawns[i % spawns.size()];
		if (spawn.IsA("BasePart")) character.HumanoidRootPart.Position = spawn.Position;
	}
}
