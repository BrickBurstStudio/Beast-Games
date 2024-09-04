import { BaseComponent, Component } from "@flamework/components";
import { OnInit, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { ClaimComponentProps, ClaimComponent } from "./claim-component";

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
export class BriefcaseComponent
	extends ClaimComponent<BriefcaseProps, ReplicatedStorage["Assets"]["Objects"]["Briefcase"]>
	implements OnStart
{
	private readonly safeColor = Color3.fromRGB(0, 255, 0);
	private readonly unsafeColor = Color3.fromRGB(255, 0, 0);
	private readonly selectedColor = Color3.fromRGB(255, 255, 255);

	onStart() {
		this.onAttributeChanged("highlightMode", (mode) => {
			if (mode === "disabled") {
				this.instance.Part.Highlight.Enabled = false;
				this.instance.Part.BillboardGui.TextLabel.Text = "";
				this.attributes.touchEnabled = true;
			}
			if (mode === "reveal") {
				this.instance.Part.Highlight.FillColor = this.attributes.safe ? this.safeColor : this.unsafeColor;
				this.instance.Part.BillboardGui.TextLabel.TextColor3 = this.attributes.safe
					? this.safeColor
					: this.unsafeColor;
				this.instance.Part.BillboardGui.TextLabel.Text = this.attributes.safe ? "!" : "X";
				this.instance.Part.Highlight.Enabled = true;
				this.attributes.touchEnabled = false;
			}
			if (mode === "selected") {
				this.instance.Part.Highlight.FillColor = this.selectedColor;
				this.instance.Part.Highlight.FillTransparency = 0.25;
				this.instance.Part.BillboardGui.TextLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
				this.instance.Part.BillboardGui.TextLabel.Text = "?";
				this.instance.Part.Highlight.Enabled = true;
				this.attributes.touchEnabled = false;
			}
		});
	}
}
