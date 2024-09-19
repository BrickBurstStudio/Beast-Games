import { ServerStorage } from "@rbxts/services";
import { BaseChallenge } from "./base-challenge";
import { getCharacter } from "shared/utils/functions/getCharacter";

export class FlagChallenge extends BaseChallenge {
	protected announcements = ["Olivia", "Allison"];
	protected readonly map = new Instance("Folder");

	protected Main() {}

	protected SpawnPlayers(players: Player[]) {
		players.forEach(async (p) => {
			const character = await getCharacter(p);
			character.HumanoidRootPart.CFrame = new CFrame(100, 20, 0);
		});
	}
}
