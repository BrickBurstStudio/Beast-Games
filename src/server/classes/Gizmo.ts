import { Janitor } from "@rbxts/janitor";
import Make from "@rbxts/make";
import { CharacterRigR6 } from "@rbxts/promise-character";

export abstract class Gizmo {
	/* -------------------------------- Abstract -------------------------------- */
	abstract name: string;
	abstract tool: Tool;
	abstract activated(): void;

	/* ---------------------------------- Class --------------------------------- */
	protected owner: Player;
	protected obliterator = new Janitor();

	constructor(owner: Player) {
		this.owner = owner;
	}

	private setupAttachments() {
		const primary = this.tool.PrimaryPart!;
		this.tool
			.GetChildren()
			.filter((c): c is BasePart => c.IsA("BasePart") && c !== primary)
			.forEach((part) => {
				const oldCFrame = part.CFrame;

				const motor = Make("Motor6D", {
					Parent: primary,
					Part0: primary,
					Part1: part,
				});

				motor.C0 = oldCFrame.ToObjectSpace(primary.CFrame);
				part.Parent = primary;
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
		this.tool.Activated.Connect(() => this.activated());
	}

	private setupTool() {
		this.tool.RequiresHandle = false;
		this.tool.CanBeDropped = false;
		this.tool.ManualActivationOnly = false;
	}

	private setup() {
		this.setupAttachments();
		this.setupEvents();
		this.setupTool();
		return this;
	}

	static give(owner: Player, gizmo: new (owner: Player) => Gizmo) {
		return new gizmo(owner).setup();
	}
}
