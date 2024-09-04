import { Component } from "@flamework/components";
import { ClaimComponent, ClaimComponentProps } from "./claim-component";
import { OnStart } from "@flamework/core";

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
	onStart() {}
}
