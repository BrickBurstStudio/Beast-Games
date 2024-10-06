import { Controller, OnStart } from "@flamework/core";
import { FormatCompact } from "@rbxts/format-number";
import { Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { tweenScale } from "shared/utils/functions/tweenUtil";

@Controller()
export class GeneralController implements OnStart {
	onStart() {
		Events.challenges.moneyPileChallenge.growMoney.connect(async () => {
			const moneyAsset = Workspace.WaitForChild("MoneyPileChallenge").WaitForChild("Money") as Money;
			moneyAsset.WaitForChild("Collision");

			await tweenScale(1, 15, new TweenInfo(30), moneyAsset, (scale, number) => {
				(moneyAsset as Money).Collision.BillboardGui.TextLabel.Text = `$${FormatCompact(scale * scale, 2)}K`;
			});
		});
	}
}
