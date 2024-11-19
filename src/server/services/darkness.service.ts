import { OnStart, Service } from "@flamework/core";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { CollectionService, Players } from "@rbxts/services";
import { Events } from "server/network";

@Service()
export class Darkness implements OnStart {
	onStart() {
		CollectionService.GetTagged("darkness-hitbox").forEach((hitbox) => {
			if (!hitbox.IsA("BasePart")) return;

			hitbox.Touched.Connect((hit) => {
				const player = Players.GetPlayerFromCharacter(hit.Parent);
				if (!player) return;

				Events.animations.setBlackFade(player, true);
				task.wait(3);
				(hit.Parent as CharacterRigR6).Humanoid.Health = 0;
			});
		});
	}
}
