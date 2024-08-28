import { Components } from "@flamework/components";
import { Service } from "@flamework/core";

export default abstract class BaseChallenge {
	finished = false;

	protected abstract Main(): void;

	public Start() {
		this.Main();
		while (!this.finished) task.wait();
	}
}
