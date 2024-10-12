import { ServerStorage } from "@rbxts/services";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";

const TeamColors = {
	0: Color3.fromRGB(255, 0, 0),
	1: Color3.fromRGB(255, 255, 0),
	2: Color3.fromRGB(255, 128, 0),
	3: Color3.fromRGB(0, 191, 0),
	4: Color3.fromRGB(255, 15, 232),
};

export class BoulderChallenge extends BaseChallenge {
	protected readonly map = ServerStorage.ChallengeMaps.BoulderChallenge.Clone();

	protected async Main() {
		await this.CleanUp();
	}

	protected SpawnCharacter({ player, character, i }: SpawnCharacterArgs): void {
		character.Humanoid.WalkSpeed = 0;
		character.Humanoid.JumpHeight = 0;
		// based on i, spawn the character in the correct team
		const team = i % 5;
	}

	protected async CleanUp() {
		await Promise.all(
			this.players.map(async (player) => {
				const character = await getCharacter(player);

				character.Humanoid.WalkSpeed = 16;
				character.Humanoid.JumpHeight = 50;
			}),
		);
	}
}
