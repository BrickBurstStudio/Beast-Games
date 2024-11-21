import { Controller, OnStart } from "@flamework/core";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { Events } from "client/network";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Controller()
export class AnimationController implements OnStart {
	public tracks: Map<Animation, AnimationTrack> = new Map();

	async onStart() {
		const character = await getCharacter(Players.LocalPlayer);
		this.loadTracks(character);

		Players.LocalPlayer.CharacterAdded.Connect((character) => {
			const char = character as CharacterRigR6;
			this.loadTracks(char);
		});

		Events.animationController.play.connect((animation) => {
			this.tracks.get(animation)?.Play();
		});

		Events.animationController.stop.connect((animation) => {
			this.tracks.get(animation)?.Stop();
		});
	}

	private loadTracks(character: CharacterRigR6) {
		const animations = ReplicatedStorage.Assets.Animations.GetChildren() as Animation[];
		for (const animation of animations) {
			this.tracks.set(animation, character.Humanoid.Animator.LoadAnimation(animation));
		}
	}
}
