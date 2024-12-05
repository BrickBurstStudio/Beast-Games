import { InputData } from "shared/network";
import { Gizmo } from "../Gizmo";
import { CollectionService, ServerStorage, Workspace } from "@rbxts/services";

export class Place extends Gizmo {
	name = "Place";
	tool = ServerStorage.Assets.Gizmos.Placement.Clone();
	animations: Partial<{ idle: Animation; activated: Animation }> = {};
	animationEvents: Record<string, () => void> = {};
	activationType: "server" | "client" = "client";
	public placePosition = new Instance("BindableEvent");
	activated(inputData: InputData | undefined) {
		if (!inputData) return;
		const params = new RaycastParams();
		params.FilterType = Enum.RaycastFilterType.Include;
		params.FilterDescendantsInstances = CollectionService.GetTagged("stadium-floor");
		const results = Workspace.Raycast(inputData.origin, inputData.direction.mul(500), params);
		if (results === undefined || results.Instance === undefined || results.Normal.Y < 0.8) return;
		this.placePosition.Fire(this.owner, results.Position);
	}
}
