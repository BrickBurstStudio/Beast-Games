import { CharacterRigR6 } from "@rbxts/promise-character";
import { RunService } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Events } from "server/network";
import { store } from "server/store";
import { announce } from "server/util/announce";
import { BasePlatformChallenge } from "./base-platform.challenge";
import { cancelCountdown } from "server/util/countdown";

export class BribeChallenge extends BasePlatformChallenge {
	protected challengeDuration = RunService.IsStudio() ? 5 : 30;
	private readonly PLAYER_MULTIPLIER = 10_000;
	private readonly BRIBE_CAP = 500_000;

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

		this.obliterator.Add(
			Events.challenges.bribeChallenge.acceptBribe.connect((player) => {
				if (this.acceptedBribes.has(player)) return;
				this.acceptedBribes.add(player);
				this.playersInChallenge = this.playersInChallenge.filter((p) => p !== player);

				this.changePlatformState(player, "eliminated");

				Events.challenges.bribeChallenge.updateBribe.broadcast({
					playerCount: this.acceptedBribes.size(),
					originalAmount: this.bribeAmount,
				});

				if (this.acceptedBribes.size() === this.playersInChallenge.size() + this.acceptedBribes.size()) {
					store.setChallenge(undefined);
					cancelCountdown();
					return;
				}
			}),
		);

		while (true) {
			task.wait(0.1);

			if (this.playersInChallenge.size() !== 0) continue;

			cancelCountdown();
			this.acceptedBribes.forEach((player) => {
				const data = new OrderedPlayerData(player);
				data.cash.UpdateBy(this.bribeAmount / this.acceptedBribes.size());
				this.dropCharacter(player.Character as CharacterRigR6);
			});
			await announce(["Everyone accepted the bribe"]);
			break;
		}
	}
}
