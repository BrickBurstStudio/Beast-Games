import { Controller, OnStart } from "@flamework/core";
import Make from "@rbxts/make";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { ContextActionService, Players, Workspace } from "@rbxts/services";
import { debounce } from "@rbxts/set-timeout";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Controller()
export default class MovementController implements OnStart {
	readonly diveActionName = "DIVE";
	animations = {
		dive: Make("Animation", { AnimationId: "rbxassetid://135272560059207", Parent: Workspace }),
	} as const;
	tracks: Partial<Record<keyof typeof this.animations, AnimationTrack>> = {};
	diveDebounce = debounce(
		() => {
			print("here");
			this.tracks.dive?.Play();
		},
		1,
		{ leading: true },
	);

	onStart() {
		void this.SetupTracks();
		Players.LocalPlayer.CharacterAdded.Connect(() => void this.SetupTracks());
		ContextActionService.BindAction(
			this.diveActionName,
			(...args) => this.PerformDive(...args),
			true,
			Enum.KeyCode.E,
			Enum.KeyCode.ButtonY,
		);
	}

	async SetupTracks() {
		const character = await getCharacter(Players.LocalPlayer);
		for (const [name, animation] of pairs(this.animations)) {
			this.tracks[name] = character.Humanoid.Animator.LoadAnimation(animation);
		}
		this.tracks.dive?.GetMarkerReachedSignal("Dive").Connect(() => {
			const prevWalkSpeed = character.Humanoid.WalkSpeed;
			const prevJumpPower = character.Humanoid.JumpPower;

			character.Humanoid.WalkSpeed = 0;
			character.Humanoid.JumpPower = 0;

			character.HumanoidRootPart.AssemblyLinearVelocity = character.HumanoidRootPart.CFrame.LookVector.mul(
				50,
			).mul(character.HumanoidRootPart.GetMass());

			while (this.diveDebounce.pending()) task.wait();

			character.Humanoid.WalkSpeed = prevWalkSpeed;
			character.Humanoid.JumpPower = prevJumpPower;
		});
	}

	PerformDive(_actionName: string, inputState: Enum.UserInputState, _inputObject: InputObject) {
		if (inputState !== Enum.UserInputState.Begin) return;
		if (this.diveDebounce.pending()) return;
		this.diveDebounce();
	}
}
