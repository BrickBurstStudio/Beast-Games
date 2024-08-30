import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Make from "@rbxts/make";
import { Players } from "@rbxts/services";

export interface ClaimComponentProps {
	owner: Player["Name"] | undefined;
	touchEnabled: boolean;
}

@Component({
	defaults: {
		claimEnabled: true,
	},
})
export default class ClaimComponent<A extends ClaimComponentProps, I extends BasePart> extends BaseComponent<A, I> {
	public readonly claimedEvent = Make("BindableEvent", {});
	private claimBGUI = Make;

	constructor() {
		super();
		this.SetupConnections();
	}

	protected Reset() {
		this.attributes.touchEnabled = false;
		this.attributes.owner = undefined;
	}

	private SetupConnections() {
		this.instance.Touched.Connect((part) => {
			if (!this.attributes.touchEnabled) return;
			if (!part.Parent?.FindFirstChildOfClass("Humanoid")) return;
			const player = Players.GetPlayerFromCharacter(part.Parent);
			if (!player) return;
			this.attributes.owner = player.Name;
			this.attributes.touchEnabled = false;
			this.claimedEvent.Fire(player);
			print("touched");
		});
	}
}
