import { Janitor } from "@rbxts/janitor";
import Make from "@rbxts/make";
import Object from "@rbxts/object-utils";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { debounce, Debounced } from "@rbxts/set-timeout";
import { Events } from "server/network";
import { InputData } from "shared/network";

type GizmoConfigs = {
	activatedInterval?: number;
};

export abstract class Gizmo {
	/* -------------------------------- Abstract -------------------------------- */
	abstract name: string;
	abstract tool: Tool;
	abstract animations: Partial<{
		idle: Animation;
		activated: Animation;
	}>;
	abstract animationEvents: Record<string, () => void>;
	abstract activated(inputData: InputData | undefined): void;
	abstract activationType: "server" | "client";

	/* ---------------------------------- Class --------------------------------- */
	protected owner: Player;
	protected obliterator = new Janitor();
	protected readonly activatedDebounce: Debounced<(inputData: InputData | undefined) => void>;
	public destroyed = false;

	/* ------------------------------ Configurable ------------------------------ */
	// Default values here
	protected ACTIVATED_INTERVAL = 0.5;

	constructor(owner: Player, configs: GizmoConfigs = {}) {
		this.obliterator.SupressInstanceReDestroy = true;
		this.owner = owner;
		this.ACTIVATED_INTERVAL = configs.activatedInterval ?? this.ACTIVATED_INTERVAL;

		this.activatedDebounce = debounce(
			(inputData: InputData | undefined) => {
				if (this.animations.activated) Events.animationController.play(this.owner, this.animations.activated);
				this.activated(inputData);
			},
			this.ACTIVATED_INTERVAL,
			{ leading: true, trailing: false },
		);

		Events.inputActivated.connect((player, inputData) => {
			if (player !== this.owner || this.tool.Parent === undefined || this.tool.Parent !== this.owner.Character)
				return;
			if (this.activationType === "client") this.activatedDebounce(inputData);
		});
	}

	private setupAttachments() {
		const primary = this.tool.PrimaryPart;
		if (!primary) return (this.tool.Parent = this.owner.Character);
		this.tool
			.GetChildren()
			.filter((c): c is BasePart => c.IsA("BasePart") && c !== primary)
			.forEach((part) => {
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
		this.tool.Activated.Connect(() => {
			if (this.activationType === "server") this.activatedDebounce(undefined);
		});

		this.tool.Equipped.Connect(() => {
			if (this.animations.idle) Events.animationController.play(this.owner, this.animations.idle);
		});

		this.tool.Unequipped.Connect(() => {
			if (this.animations.idle) Events.animationController.stop(this.owner, this.animations.idle);
		});

		Object.entries(this.animationEvents).forEach(([event, func]) => {});
	}

	private setupTool() {
		this.tool.RequiresHandle = false;
		this.tool.CanBeDropped = false;
		this.tool.ManualActivationOnly = false;

		this.tool.GetChildren().forEach((child) => {
			if (!child.IsA("BasePart")) return;
			child.Massless = true;
			child.CanCollide = false;
		});

		this.tool.Destroying.Connect(() => {
			if (this.destroyed) return;
			this.destroyed = true;
			this.obliterator.Destroy();
		});
	}

	private setup() {
		this.setupAttachments();
		this.setupEvents();
		this.setupTool();

		if (this.animations.idle) Events.animationController.play(this.owner, this.animations.idle);
		return this;
	}

	destroy() {
		if (this.destroyed) return;
		this.obliterator.Destroy();
		this.destroyed = true;
	}

	static give<T extends Gizmo>(owner: Player, gizmo: new (owner: Player) => T): T {
		return new gizmo(owner).setup();
	}
}
