import { BasePlatformChallenge } from "./base-platform.challenge";

export class FreebyChallenge extends BasePlatformChallenge {
	protected readonly challengeName = "Freeby";
	protected readonly rules = ["Players must stay on the platforms"];

	protected async main() {
		this.playersInChallenge.forEach((player) => this.changePlatformState(player, "safe"));
		task.wait(5000);
	}
}
