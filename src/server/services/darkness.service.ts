import { OnStart, Service } from "@flamework/core";
import { CollectionService, Players } from "@rbxts/services";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Service()
export class DarknessService implements OnStart {
	onStart() {
		CollectionService.GetTagged("darkness-hitbox").forEach((hitbox) => {
			if (!hitbox.IsA("BasePart")) return;

			hitbox.Touched.Connect(async (hit) => {
				const player = Players.GetPlayerFromCharacter(hit.Parent);
				if (
					!player ||
					player.Character === undefined ||
					(player.Character.WaitForChild("Humanoid") as Humanoid).Health === 0
				)
					return;

				(player.Character.WaitForChild("Humanoid") as Humanoid).Health = 0;
			});
		});
	}
}
