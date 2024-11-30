import { Players, ServerStorage, Workspace } from "@rbxts/services";
import { Gizmo } from "../Gizmo";
import { InputData } from "shared/network";
import { isCharacterPart } from "shared/utils/functions/isCharacterPart";

export class Ball extends Gizmo {
	private readonly BALL_FORCE = 80;

	animations = {};
	name = "Ball";
	tool = ServerStorage.Assets.Gizmos.Ball.Clone();
	activationType = "client" as const;

	activated(inputData: InputData | undefined) {
		if (!inputData) return;

		const ball = ServerStorage.Assets.Objects.Ball.Clone();

		const connection = ball.Touched.Connect((hit) => {
			if (!isCharacterPart(hit) || Players.GetPlayerFromCharacter(hit.Parent) === this.owner) return;

			connection.Disconnect();
			ball.Destroy();
		});

		ball.CFrame = this.tool.PrimaryPart!.CFrame;
		ball.Parent = Workspace;
		ball.SetNetworkOwner(this.owner);
		ball.AssemblyLinearVelocity = inputData.direction.mul(this.BALL_FORCE).add(new Vector3(0, 40, 0));

		this.destroy();
	}
}
