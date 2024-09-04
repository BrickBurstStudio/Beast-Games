import { Component } from "@flamework/components";
import ClaimComponent, { ClaimComponentProps } from "./claim-component";
import { OnStart } from "@flamework/core";

@Component({
	tag: "flag",
	defaults: {
		touchEnabled: true,
	},
})
export default class FlagComponent
	extends ClaimComponent<ClaimComponentProps, ReplicatedStorage["Assets"]["Objects"]["Flag"]>
	implements OnStart
{
	onStart() {}
}
