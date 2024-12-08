import { Controller, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { KeyframeSequenceProvider, Players, ReplicatedStorage } from "@rbxts/services";
import { Events } from "client/network";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Controller()
export class AnimationController implements OnStart {
	public tracks: Map<Animation, AnimationTrack> = new Map();

	async onStart() {
		if (Players.LocalPlayer.Character !== undefined) {
			const character = await getCharacter(Players.LocalPlayer);
			this.loadTracks(character);
		}

		Players.LocalPlayer.CharacterAdded.Connect(async () => {
			const character = await getCharacter(Players.LocalPlayer);
			this.loadTracks(character);
		});

		Events.animationController.play.connect((animation) => {
			this.tracks.get(animation)?.Play();
		});

		Events.animationController.stop.connect((animation) => {
			this.tracks.get(animation)?.Stop();
		});
	}

	private loadTracks(character: CharacterRigR6) {
		const animations = this.getAllAnimations(ReplicatedStorage.Assets.Animations);
		for (const animation of animations) {
			const track = character.Humanoid.Animator.LoadAnimation(animation);
			const markers = this.getAllAnimationEventNames(animation.AnimationId);

			markers.forEach((marker) => {
				track.GetMarkerReachedSignal(marker.Name).Connect(() => {
					Events.animationController.event(marker.Name);
				});
			});

			this.tracks.set(animation, track);
		}
	}

	private getAllAnimations(parent: Instance): Animation[] {
		const animations: Animation[] = [];
		
		const recurse = (instance: Instance) => {
			for (const child of instance.GetChildren()) {
				if (child.IsA("Animation")) {
					animations.push(child as Animation);
				}
				if (child.GetChildren().size() > 0) {
					recurse(child);
				}
			}
		};

		recurse(parent);
		return animations;
	}

	private getAllAnimationEventNames(animId: string): KeyframeMarker[] {
		const markers: KeyframeMarker[] = [];
		const keyframeSequence = KeyframeSequenceProvider.GetKeyframeSequenceAsync(animId);

		const recurse = (parent: Instance): void => {
			for (const child of parent.GetChildren()) {
				if (child.IsA("KeyframeMarker")) {
					markers.push(child as KeyframeMarker);
				}
				if (child.GetChildren().size() > 0) {
					recurse(child);
				}
			}
		};

		recurse(keyframeSequence);
		return markers;
	}
}
