import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ClaimComponent, ClaimComponentProps } from "./claim.component";

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
				this.instance.Part.BrickColor = new BrickColor("Dark stone grey");
				this.instance.Part.BillboardGui.TextLabel.Text = "";
				this.attributes.touchEnabled = true;
			}
			if (mode === "reveal") {
				this.instance.Part.Color = this.attributes.safe ? this.safeColor : this.unsafeColor;
				this.instance.Part.BillboardGui.TextLabel.TextColor3 = this.attributes.safe
					? this.safeColor
					: this.unsafeColor;
				this.instance.Part.BillboardGui.TextLabel.Text = this.attributes.safe ? "!" : "X";
				this.attributes.touchEnabled = false;
			}
			if (mode === "selected") {
				this.instance.Part.BrickColor = new BrickColor("White");
				this.instance.Part.BillboardGui.TextLabel.TextColor3 = this.selectedColor;
				this.instance.Part.BillboardGui.TextLabel.Text = "?";
				this.attributes.touchEnabled = false;
			}
		});
	}
}
