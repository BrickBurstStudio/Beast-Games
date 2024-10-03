import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ClaimComponent, ClaimComponentProps } from "./claim.component";

@Component({
	tag: "flag-pole",
	defaults: {
		touchEnabled: true,
	},
})
export class FlagPoleComponent
	extends ClaimComponent<ClaimComponentProps, ReplicatedStorage["Assets"]["Objects"]["FlagPole"]>
	implements OnStart
{
	onStart() {}
}
