import { ServerStorage } from "@rbxts/services";
import { Gizmo } from "../Gizmo";

export class ExampleGizmo extends Gizmo {
	animations = {};
	name = "Example Gizmo";
	tool = ServerStorage.Assets.Gizmos.ExampleGizmo;

	activated() {
		print("Example Gizmo activated");
	}
}
