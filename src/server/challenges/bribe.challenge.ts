import { Events } from "server/network";
import { BasePlatformChallenge } from "./base-platform.challenge";
import { announce } from "server/util/announce";
import { countdown } from "server/util/countdown";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { store } from "server/store";

export class BribeChallenge extends BasePlatformChallenge {
	private readonly PLAYER_MULTIPLIER = 10_000;
	private readonly BRIBE_CAP = 500_000;
	private readonly BRIBE_TIME = 10;

	protected readonly challengeName = "Bribe" as const;
	protected readonly rules = [
		"If you accept the bribe, you will be eliminated",
		"But, if you accept the bribe, you will receive money",
		"The total amount is split evenly among the players who accepted a bribe",
		"This means that the more players who accept, the less you get",
	];
	private readonly acceptedBribes = new Set<Player>();
	private bribeAmount = 0;

	protected async main() {
		this.bribeAmount = math.clamp(this.playersInChallenge.size() * this.PLAYER_MULTIPLIER, 0, this.BRIBE_CAP);
		Events.challenges.bribeChallenge.updateBribe.broadcast({
			playerCount: 0,
			originalAmount: this.bribeAmount,
		});

		Events.challenges.bribeChallenge.acceptBribe.connect((player) => {
			if (this.acceptedBribes.has(player)) return;
			this.acceptedBribes.add(player);
			this.playersInChallenge = this.playersInChallenge.filter((p) => p !== player);

			this.changePlatformState(player, "eliminated");

			Events.challenges.bribeChallenge.updateBribe.broadcast({
				playerCount: this.acceptedBribes.size(),
				originalAmount: this.bribeAmount,
			});
		});

		await countdown({ seconds: this.BRIBE_TIME, showGo: false });
		store.setChallenge(undefined);

		this.acceptedBribes.forEach((player) => {
			spawn(() => {
				const data = new OrderedPlayerData(player);
				data.cash.UpdateBy(this.bribeAmount / this.acceptedBribes.size());
				task.wait(2);
				this.dropPlayer(player);
			});
		});
		task.wait(3);
	}
}
