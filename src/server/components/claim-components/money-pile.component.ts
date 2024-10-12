import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Make from "@rbxts/make";
import { ClaimComponent, ClaimComponentProps } from "./claim.component";

@Component({
	tag: "money-pile",
	defaults: {
		touchEnabled: true,
	},
})
export class MoneyPileComponent
	extends ClaimComponent<ClaimComponentProps, ReplicatedStorage["Assets"]["Objects"]["SmallMoney"]>
	implements OnStart
{
	onStart() {
		this.instance;
	}
}
