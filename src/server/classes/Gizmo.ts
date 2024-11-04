import { Janitor } from "@rbxts/janitor";
import Make from "@rbxts/make";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { gizmos } from "server/config/gizmos";

export type GizmoProps = {
	owner: Player;
	name: string;
	tool: Tool;
	idle?: Animation;
	activate?: Animation;
	equip?: Animation;
};

export default class Gizmo {
	private readonly props: GizmoProps;
	private readonly obliterator: Janitor = new Janitor();
	private tool: Tool;

	constructor(props: GizmoProps) {
		if (props.tool.PrimaryPart === undefined) throw `Gizmo tool ${props.name} has no primary part`;
		if (props.owner.Character === undefined) throw `Gizmo owner ${props.owner.Name} has no character`;

		this.props = props;
		this.tool = props.tool.Clone();
		this.setup();
	}

	setup() {
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
			Part0: (this.props.owner.Character as CharacterRigR6)["Right Arm"],
			Part1: this.tool.PrimaryPart!,
		});

		primary.Anchored = false;
		this.obliterator.Add(this.tool);
		this.tool.Parent = this.props.owner.Character;
	}

	destroy() {
		this.obliterator.Cleanup();
	}

	static give(player: Player, gizmoName: keyof typeof gizmos) {
		return new Gizmo({ ...gizmos[gizmoName], owner: player });
	}
}
