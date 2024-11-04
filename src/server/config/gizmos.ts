import { ServerStorage } from "@rbxts/services";
import { GizmoProps } from "server/classes/Gizmo";

export const gizmos = {
	exampleGizmo: {
		name: "Example Gizmo",
		tool: ServerStorage.Assets.Gizmos.ExampleGizmo,
	},
} as const satisfies Record<string, Omit<GizmoProps, "owner">>;
