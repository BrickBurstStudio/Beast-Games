import { ServerStorage } from "@rbxts/services";
import { Gizmo } from "../Gizmo";

export class ExampleGizmo extends Gizmo {
	animationEvents: Record<string, () => void> = {};
	animations = {};
	name = "Example Gizmo";
	tool = ServerStorage.Assets.Gizmos.ExampleGizmo;
	activationType = "server" as const;

	activated() {}
}
