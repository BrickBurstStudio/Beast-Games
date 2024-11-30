import { Controller, OnStart } from "@flamework/core";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { InputData } from "shared/network";

@Controller()
export class GizmoController implements OnStart {
	onStart() {
		UserInputService.InputBegan.Connect((input) => {
			if (input.UserInputType === Enum.UserInputType.MouseButton1) {
				const mouse = Players.LocalPlayer.GetMouse();

				Events.inputActivated.fire({
					origin: mouse.UnitRay.Origin,
					direction: mouse.UnitRay.Direction,
				});
			}
		});

		UserInputService.TouchTapInWorld.Connect((position) => {
			print(position);
			const ray = Workspace.CurrentCamera!.ViewportPointToRay(position.X, position.Y);

			Events.inputActivated.fire({
				origin: ray.Origin,
				direction: ray.Direction,
			});
		});
	}
}
