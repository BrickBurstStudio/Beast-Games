import { OnStart, Service } from "@flamework/core";
import { CollectionService, Players } from "@rbxts/services";
import { Events } from "server/network";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Service()
export class DarknessService implements OnStart {
	private touchCooldown = new Map<Player, boolean>();

	onStart() {
		CollectionService.GetTagged("darkness-hitbox").forEach((hitbox) => {
			if (!hitbox.IsA("BasePart")) return;

			hitbox.Touched.Connect(async (hit) => {
				const player = Players.GetPlayerFromCharacter(hit.Parent);
				if (
					!player ||
					player.Character === undefined ||
					(player.Character.WaitForChild("Humanoid") as Humanoid).Health === 0 ||
					this.touchCooldown.get(player) !== undefined
				)
					return;
				const character = await getCharacter(player);
				this.touchCooldown.set(player, true);
				Events.animations.setBlackFade(player, true);
				task.wait(1);
				if (character && character.Parent !== undefined) character.Humanoid.Health = 0;
				this.touchCooldown.delete(player);
			});
		});
	}
}
