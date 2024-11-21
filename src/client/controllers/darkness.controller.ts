import { OnStart, Controller } from "@flamework/core";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { CollectionService, Players } from "@rbxts/services";
import { Events } from "client/network";

@Controller()
export class DarknessController implements OnStart {
	onStart() {
		let touched = false;

		CollectionService.GetTagged("darkness-hitbox").forEach((hitbox) => {
			if (!hitbox.IsA("BasePart")) return;

			hitbox.Touched.Connect((hit) => {
				const player = Players.GetPlayerFromCharacter(hit.Parent);
				if (!player && player !== Players.LocalPlayer) return;

				if (touched) return;
				touched = true;

				Events.animations.setBlackFade.predict(true);
				task.wait(1);
				Events.reset.fire();
				task.wait(3);
				touched = false;
			});
		});
	}
}
