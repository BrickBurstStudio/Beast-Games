import { ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { Gizmo } from "../Gizmo";
import { debounce, Debounced } from "@rbxts/set-timeout";
import { isCharacterPart } from "shared/utils/functions/isCharacterPart";
import Make from "@rbxts/make";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { spawnSound } from "shared/utils/functions/spawnSound";

export class Pugil extends Gizmo {
	/* -------------------------------- Abstract -------------------------------- */
	animations = {
		idle: ReplicatedStorage.Assets.Animations.PugilIdle,
		activated: ReplicatedStorage.Assets.Animations.PugilActivated,
	};
	name = "Pugil";
	tool = ServerStorage.Assets.Gizmos.Pugil.Clone();

	/* ---------------------------------- Class --------------------------------- */
	private hitDebounce: Debounced<(character: CharacterRigR6) => void>;

	/* ------------------------------ Configuration ----------------------------- */
	private MAX_FORCE_MULTIPLIER = 15000;
	private VELOCITY_MAGNITUDE = 50;
	private VELOCITY_DURATION = 0.25;

	constructor(owner: Player) {
		super(owner);

		this.hitDebounce = debounce(
			(character: CharacterRigR6) => {
				this.hit(character);
			},
			this.ACTIVATED_INTERVAL,
			{ leading: true, trailing: false },
		);

		this.tool.Side1.Touched.Connect((hit: BasePart) => {
			if (!this.activatedDebounce.pending() || !isCharacterPart(hit)) return;
			const character = hit.Parent as CharacterRigR6;
			this.hitDebounce(character);
		});
	}

	activated() {
		spawnSound(ReplicatedStorage.Assets.Sounds.PugilSwing, this.tool.Base);
	}

	hit(character: CharacterRigR6) {
		spawnSound(ReplicatedStorage.Assets.Sounds.PugilHit, character.HumanoidRootPart);

		const velocity = Make("LinearVelocity", {
			Name: "PugilVelocity",
			Attachment0: character.HumanoidRootPart.RootAttachment,
			RelativeTo: Enum.ActuatorRelativeTo.World,
			MaxForce: this.MAX_FORCE_MULTIPLIER * character.HumanoidRootPart.AssemblyMass,
			VectorVelocity: (this.owner.Character as CharacterRigR6).HumanoidRootPart.CFrame.LookVector.mul(
				this.VELOCITY_MAGNITUDE,
			),
			Parent: character.HumanoidRootPart,
		});

		task.wait(this.VELOCITY_DURATION);
		velocity.Destroy();
	}
}
