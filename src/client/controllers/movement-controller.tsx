import { Controller, OnStart } from "@flamework/core";
import Make from "@rbxts/make";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { ContextActionService, Players, Workspace } from "@rbxts/services";
import { debounce } from "@rbxts/set-timeout";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { SprintController } from "./sprint-controller";

// todo : organize subsystem logic into sister controllers & use dependency injection here

@Controller()
export class MovementController implements OnStart {
	readonly diveActionName = "DIVE";
	readonly sprintActionName = "SPRINT";
	public readonly maxStamina = 100;
	public stamina = this.maxStamina;
	public static staminaEvent = Make("BindableEvent", {});
	private readonly staminaRegenAmount = 1;
	private readonly staminaTickDuration = 0.1;
	private readonly staminaSprintCost = 2.5;
	private readonly sprintWalkSpeed = 35;
	private readonly defaultWalkSpeed = 16;
	private animations = {
		dive: Make("Animation", { AnimationId: "rbxassetid://135272560059207", Parent: Workspace }),
	} as const;
	private tracks: Partial<Record<keyof typeof this.animations, AnimationTrack>> = {};
	private diveDebounce = debounce(
		() => {
			print("here");
			this.tracks.dive?.Play();
		},
		1,
		{ leading: true },
	);
	private sprinting = false;
	private lastCharacterReference: CharacterRigR6 | undefined;

	constructor(private sprintController: SprintController) {}

	onStart() {
		void this.SetupTracks();
		Players.LocalPlayer.CharacterAdded.Connect((character) => {
			void this.SetupTracks();
			this.lastCharacterReference = character as CharacterRigR6;
		});
		ContextActionService.BindAction(
			this.diveActionName,
			(...args) => this.PerformDive(...args),
			true,
			Enum.KeyCode.E,
			Enum.KeyCode.ButtonY,
		);
		ContextActionService.BindAction(
			this.sprintActionName,
			(...args) => this.ToggleSprint(...args),
			true,
			Enum.KeyCode.LeftShift,
			Enum.KeyCode.X,
		);
		this.SetupStaminaRegeneration();
	}

	private async ToggleSprint(_actionName: string, inputState: Enum.UserInputState, _inputObject: InputObject) {
		this.sprinting = inputState === Enum.UserInputState.Begin;
		const character = await getCharacter(Players.LocalPlayer);
		if (!character) return;
		character.Humanoid.WalkSpeed = this.sprinting ? this.sprintWalkSpeed : this.defaultWalkSpeed;
	}

	private PerformDive(_actionName: string, inputState: Enum.UserInputState, _inputObject: InputObject) {
		if (inputState !== Enum.UserInputState.Begin) return;
		if (this.diveDebounce.pending()) return;
		this.diveDebounce();
	}
	private async SetupTracks() {
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

	private ChangeStaminaBy(amount: number) {
		this.stamina = math.clamp(this.stamina + amount, 0, this.maxStamina);
		MovementController.staminaEvent.Fire(this.stamina);
	}

	private SetupStaminaRegeneration() {
		task.spawn(() => {
			while (true) {
				task.wait(this.staminaTickDuration);
				if (!this.sprinting) this.ChangeStaminaBy(this.staminaRegenAmount);
				else this.ChangeStaminaBy(-this.staminaSprintCost);
				if (this.stamina < this.staminaSprintCost && this.lastCharacterReference) {
					this.lastCharacterReference.Humanoid.WalkSpeed = this.defaultWalkSpeed;
					this.sprinting = false;
				}
				print(this.stamina);
			}
		});
	}
}
