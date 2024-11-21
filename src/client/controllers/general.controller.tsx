import { Controller, OnInit, OnStart } from "@flamework/core";
import { FormatCompact, FormatStandard } from "@rbxts/format-number";
import { ReplicatedStorage, StarterGui, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { tweenScale, tweenNumber } from "shared/utils/functions/tweenUtil";

@Controller()
export class GeneralController implements OnStart {
	// ! To Disable Reset Button: Delete 'DisableReset' local script in Roblox Studio

	onStart() {
		let lastModel: Model | undefined;
		Events.challenges.moneyPileChallenge.dropMoney.connect(async (model) => {
			const clone = model.Clone();
			if (!clone.PrimaryPart) return error("Model has no primary part");
			clone.Parent = Workspace;

			if (lastModel) {
				lastModel.Destroy();
			}
			lastModel = clone;

			const moneyBGUI = ReplicatedStorage.Assets.Gui.DollarBGUI.Clone();
			moneyBGUI.Parent = clone.PrimaryPart;
			moneyBGUI.StudsOffset = new Vector3(0, clone.PrimaryPart.Size.Y, 0);
			moneyBGUI.Size = UDim2.fromScale(clone.PrimaryPart.Size.Magnitude, clone.PrimaryPart.Size.Y);
			moneyBGUI.TextLabel.Text = `$${FormatStandard(model.PrimaryPart!.FindFirstChildOfClass("NumberValue")?.Value ?? 0)}`;

			const goalCFrame = Workspace.Stadium.Center.CFrame.mul(new CFrame(0, clone.PrimaryPart.Size.Y / 2, 0));
			const startHeight = goalCFrame.add(new Vector3(0, 50, 0));

			clone.PivotTo(startHeight);
			task.wait(0.1);

			// todo : add camera shake

			await tweenNumber(
				startHeight.Y,
				goalCFrame.Y,
				new TweenInfo(2, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out),
				(number) => {
					clone.PivotTo(
						new CFrame(goalCFrame.X, number, goalCFrame.Z).mul(goalCFrame.sub(goalCFrame.Position)),
					);
				},
			);
		});
	}
}
