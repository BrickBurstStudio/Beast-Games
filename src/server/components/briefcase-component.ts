import { BaseComponent, Component } from "@flamework/components";
import { OnInit, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import ClaimComponent, { ClaimComponentProps } from "./claim-component";

interface BriefcaseProps extends ClaimComponentProps {
	safe: boolean;
	highlightMode: "selected" | "reveal" | "disabled";
}

@Component({
	tag: "briefcase",
	defaults: {
		safe: true,
		highlightMode: "disabled",
		touchEnabled: false,
	},
})
export default class BriefcaseComponent
	extends ClaimComponent<BriefcaseProps, ReplicatedStorage["Assets"]["Objects"]["Briefcase"]>
	implements OnStart
{
	private readonly safeColor = Color3.fromRGB(0, 255, 0);
	private readonly unsafeColor = Color3.fromRGB(255, 0, 0);
	private readonly selectedColor = Color3.fromRGB(255, 255, 255);

	onStart() {
		this.onAttributeChanged("highlightMode", (mode) => {
			if (mode === "disabled") {
				this.instance.Highlight.Enabled = false;
				this.instance.BillboardGui.TextLabel.Text = "";
				this.attributes.touchEnabled = true;
			}
			if (mode === "reveal") {
				this.instance.Highlight.FillColor = this.attributes.safe ? this.safeColor : this.unsafeColor;
				this.instance.BillboardGui.TextLabel.TextColor3 = this.attributes.safe
					? this.safeColor
					: this.unsafeColor;
				this.instance.BillboardGui.TextLabel.Text = this.attributes.safe ? "!" : "X";
				this.instance.Highlight.Enabled = true;
				this.attributes.touchEnabled = false;
			}
			if (mode === "selected") {
				this.instance.Highlight.FillColor = this.selectedColor;
				this.instance.Highlight.FillTransparency = 0.25;
				this.instance.BillboardGui.TextLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
				this.instance.BillboardGui.TextLabel.Text = "?";
				this.instance.Highlight.Enabled = true;
				this.attributes.touchEnabled = false;
			}
		});
	}
}
