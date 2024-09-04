import { Component } from "@flamework/components";
import { ClaimComponent, ClaimComponentProps } from "./claim-component";
import { OnStart } from "@flamework/core";
import Make from "@rbxts/make";

@Component({
	tag: "money-pile",
	defaults: {
		touchEnabled: true,
	},
})
export class MoneyPileComponent
	extends ClaimComponent<ClaimComponentProps, ReplicatedStorage["Assets"]["Objects"]["MoneyPile"]>
	implements OnStart
{
	private dollarsBGUI = Make("BillboardGui", {
		Parent: this.instance,
		Size: UDim2.fromScale(4, 2),
		StudsOffset: new Vector3(0, this.instance.PrimaryPart!.Size.Y + 3, 0),
		Adornee: this.instance.PrimaryPart,
		Children: [
			Make("TextLabel", {
				Size: UDim2.fromScale(1, 1),
				BackgroundTransparency: 1,
				Text: `${this.instance.Dollars.Value}`,
				TextScaled: true,
				TextColor3: Color3.fromRGB(255, 255, 255),
			}),
		],
	});

	onStart() {
		this.instance;
	}
}
