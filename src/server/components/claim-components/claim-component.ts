import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Make from "@rbxts/make";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { getPlayerByName } from "shared/utils/functions/getPlayerByName";

export interface ClaimComponentProps {
	owner: Player["Name"] | undefined;
	touchEnabled: boolean;
}

@Component({
	defaults: {
		claimEnabled: true,
	},
	predicate: (instance) => instance.IsA("Model") && instance.PrimaryPart !== undefined,
})
export class ClaimComponent<A extends ClaimComponentProps, I extends Model> extends BaseComponent<A, I> {
	public readonly claimedEvent = Make("BindableEvent", {});
	private claimBGUI = ReplicatedStorage.Assets.Gui.ClaimBGUI.Clone();

	static playerClaims: Record<Player["UserId"], boolean> = {};

	constructor() {
		super();
		this.SetupTouch();
		this.SetupClaimBGUI();
	}

	protected Reset() {
		if (this.attributes.owner !== undefined) {
			const player = getPlayerByName(this.attributes.owner);
			if (player) ClaimComponent.playerClaims[player.UserId] = false;
		}
		this.attributes.touchEnabled = false;
		this.attributes.owner = undefined;
	}

	private SetupClaimBGUI() {
		this.claimBGUI.Parent = this.instance.PrimaryPart!;
		this.onAttributeChanged("owner", (value) => {
			if (value === undefined) {
				this.claimBGUI.TextLabel.Text = "";
				this.claimBGUI.Enabled = false;
			} else {
				this.claimBGUI.TextLabel.Text = `<i>Claimed by: </i><b>${value}</b>`;
				this.claimBGUI.Enabled = true;
			}
		});
	}

	private SetupTouch() {
		this.instance.PrimaryPart!.Touched.Connect((part) => {
			if (!this.attributes.touchEnabled) return;
			if (!part.Parent?.FindFirstChildOfClass("Humanoid")) return;
			const player = Players.GetPlayerFromCharacter(part.Parent);
			if (!player) return;
			if (ClaimComponent.playerClaims[player.UserId] === true) return;
			this.attributes.owner = player.Name;
			this.attributes.touchEnabled = false;
			ClaimComponent.playerClaims[player.UserId] = true;
			this.claimedEvent.Fire(player);
		});
	}
}
