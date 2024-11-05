import { ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { Gizmo } from "../Gizmo";

export class Pugil extends Gizmo {
	animations = {
		idle: ReplicatedStorage.Assets.Animations.PugilIdle,
		activated: ReplicatedStorage.Assets.Animations.PugilActivated,
	};
	name = "Pugil";
	tool = ServerStorage.Assets.Gizmos.Pugil;

	activated() {
		print("Pugil activated");
	}
}
