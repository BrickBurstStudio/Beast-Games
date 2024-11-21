import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ClaimComponent, ClaimComponentProps } from "./claim.component";

@Component({
	tag: "green-claim",
	defaults: {
		touchEnabled: true,
	},
})
export class GreenClaimComponent
	extends ClaimComponent<
		ClaimComponentProps,
		ServerStorage["ChallengeMaps"]["GoldRushChallenge"]["Claims"]["GreenClaim"]
	>
	implements OnStart
{
	private readonly safeColor = Color3.fromRGB(0, 255, 0);
	private readonly unsafeColor = Color3.fromRGB(255, 0, 0);
	private readonly selectedColor = Color3.fromRGB(255, 255, 255);

	onStart() {
		this.claimBGUI.MaxDistance = math.huge;
	}
}
