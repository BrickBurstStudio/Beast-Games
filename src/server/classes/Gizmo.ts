import { Janitor } from "@rbxts/janitor";
import Make from "@rbxts/make";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { debounce } from "@rbxts/set-timeout";
import { Events } from "server/network";
export abstract class Gizmo {
	/* ------------------------------ Configurable ------------------------------ */
	protected ACTIVATED_INTERVAL = 0.5;

	/* -------------------------------- Abstract -------------------------------- */
	abstract name: string;
	abstract tool: Tool;
	abstract animations: Partial<{
		idle: Animation;
		activated: Animation;
	}>;
	abstract activated(): void;

	/* ---------------------------------- Class --------------------------------- */
	protected owner: Player;
	protected obliterator = new Janitor();
	private activatedDebounce;

	constructor(owner: Player) {
		this.owner = owner;

		this.activatedDebounce = debounce(
			() => {
				if (this.animations.activated) Events.animationController.play(this.owner, this.animations.activated);
				this.activated();
			},
			this.ACTIVATED_INTERVAL,
			{ leading: true, trailing: false },
		);
	}

	private setupAttachments() {
		const primary = this.tool.PrimaryPart!;
		this.tool
			.GetChildren()
			.filter((c): c is BasePart => c.IsA("BasePart") && c !== primary)
			.forEach((part) => {
				const oldCFrame = part.CFrame;

				const motor = Make("Motor6D", {
					Part0: primary,
					Part1: part,
				});

				motor.C0 = primary.CFrame.Inverse();
				motor.C1 = part.CFrame.Inverse();

				motor.Parent = primary;
				part.Anchored = false;
			});

		Make("Motor6D", {
			Parent: this.tool,
			Part0: (this.owner.Character as CharacterRigR6)["Right Arm"],
			Part1: this.tool.PrimaryPart!,
		});

		primary.Anchored = false;
		this.obliterator.Add(this.tool);
		this.tool.Parent = this.owner.Character;
	}

	private setupEvents() {
		this.tool.Activated.Connect(() => this.activatedDebounce());

		this.tool.Equipped.Connect(() => {
			if (this.animations.idle) Events.animationController.play(this.owner, this.animations.idle);
		});

		this.tool.Unequipped.Connect(() => {
			if (this.animations.idle) Events.animationController.stop(this.owner, this.animations.idle);
		});
	}

	private setupTool() {
		this.tool.RequiresHandle = false;
		this.tool.CanBeDropped = false;
		this.tool.ManualActivationOnly = false;

		this.tool.GetChildren().forEach((child) => {
			if (child.IsA("BasePart")) child.CanCollide = false;
		});
	}

	private setup() {
		this.setupAttachments();
		this.setupEvents();
		this.setupTool();

		if (this.animations.idle) Events.animationController.play(this.owner, this.animations.idle);
		return this;
	}

	static give(owner: Player, gizmo: new (owner: Player) => Gizmo) {
		return new gizmo(owner).setup();
	}
}
