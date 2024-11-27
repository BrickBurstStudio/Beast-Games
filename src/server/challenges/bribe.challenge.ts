import { Events } from "server/network";
import { BasePlatformChallenge } from "./base-platform.challenge";

export class BribeChallenge extends BasePlatformChallenge {
	private readonly PLAYER_MULTIPLIER = 10_000;
	private readonly BRIBE_CAP = 500_000;

	protected readonly challengeName = "Bribe" as const;
	protected readonly rules = ["Players must stay on the platforms"];
	private readonly acceptedBribes = new Set<Player>();
	private bribeAmount = 0;

	protected async main() {
		this.bribeAmount = math.clamp(this.playersInChallenge.size() * this.PLAYER_MULTIPLIER, 0, this.BRIBE_CAP);

		Events.challenges.bribeChallenge.acceptBribe.connect((player) => {
			if (this.acceptedBribes.has(player)) return;
			this.acceptedBribes.add(player);
			this.changePlatformState(player, "eliminated");
		});

		this.playersInChallenge.forEach((player) => this.changePlatformState(player, "safe"));
		task.wait(5000);
	}
}
