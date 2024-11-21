import { Controller, OnStart } from "@flamework/core";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";
import { store } from "client/store";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Controller()
export class SpectateController implements OnStart {
	async onStart() {
		this.SetupSpectate();
		Players.LocalPlayer.CharacterAdded.Connect(async () => {
			store.setSpectating(false);
			this.SetupSpectate();
		});
	}

	async SetupSpectate() {
		const character =
			(Players.LocalPlayer.Character as CharacterRigR6) ?? (await getCharacter(Players.LocalPlayer));
		character.Humanoid.Died.Connect(() => {
			task.wait(4);
			store.setSpectating(true);
		});
	}
}
