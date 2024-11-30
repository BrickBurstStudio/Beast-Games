import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ClaimComponent, ClaimComponentProps } from "./claim.component";

@Component({
	tag: "green-claim",
	defaults: {
		touchEnabled: true,
	},
})
export class GreenClaimComponent extends ClaimComponent<ClaimComponentProps, GreenClaim> implements OnStart {
	onStart() {
		this.claimBGUI.MaxDistance = math.huge;
	}
}
