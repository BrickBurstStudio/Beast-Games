import { Controller, OnStart } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";
import { LOBBY_PLACE_ID } from "shared/configs/places";

@Controller()
export class SoundController implements OnStart {
	onStart() {
		if (game.PlaceId !== LOBBY_PLACE_ID) return;

		const [lobby1, lobby2] = [
			ReplicatedStorage.Assets.Sounds.Music.Lobby1,
			ReplicatedStorage.Assets.Sounds.Music.Lobby2,
		];

		lobby1.Ended.Connect(() => {
			lobby2.Play();
		});

		lobby2.Ended.Connect(() => {
			lobby1.Play();
		});

		lobby1.Loaded.Connect(() => {
			// Start the loop
			lobby1.Play();
		});
	}
}
