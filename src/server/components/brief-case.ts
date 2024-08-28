import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

@Component({
	tag: "brief-case",
})
export default class BriefCaseComponent extends BaseComponent implements OnStart {
	onStart() {
		print(`Wow! I'm attached to ${this.instance.GetFullName()}`);
		task.wait(2);
		this.destroy();
	}
}
