import { OnStart, Service } from "@flamework/core";
import { CollectionService, Players } from "@rbxts/services";
import { Events } from "server/network";

@Service()
export class RandomAssFuckinServiceForFuckAssActivities implements OnStart {
	onStart() {
		this.setupDarknessHitbox();
	}

	setupDarknessHitbox() {
		CollectionService.GetTagged("darkness-hitbox").forEach((hitbox) => {
			if (!hitbox.IsA("BasePart")) return;

			hitbox.Touched.Connect((hit) => {
				const player = Players.GetPlayerFromCharacter(hit.Parent);
				if (!player) return;

				Events.animations.setBlackFade(player, true);
			});
		});
	}
}
