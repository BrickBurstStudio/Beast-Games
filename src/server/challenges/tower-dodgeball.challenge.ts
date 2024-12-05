import { CharacterRigR6 } from "@rbxts/promise-character";
import { CollectionService, Players } from "@rbxts/services";
import { Gizmo } from "server/classes/Gizmo";
import { Ball } from "server/classes/gizmos/Ball";
import { Tower } from "server/classes/gizmos/Tower";
import { Events } from "server/network";
import { countdown } from "server/util/countdown";
import { BasePlatformChallenge } from "./base-platform.challenge";

export class TowerDodgeballChallenge extends BasePlatformChallenge {
	private readonly TOWER_PLACE_TIME = 30;
	protected challengeDuration = 60;
	protected readonly challengeName = "Tower Dodgeball";
	protected readonly rules = [
		"Place your tower on the platform by clicking/tapping somewhere",
		"If you touch your tower, it will fall over, and you will be out",
		"You will be given a red ball afterwards",
		"Throw the ball at other players to eliminate them",
	];
	private playersToTowers = new Map<Player, BlockTower>();

	protected async main() {
		const destroyGizmos = this.giveTowerGizmos();

		const countdownPromise = countdown({
			seconds: this.TOWER_PLACE_TIME,
			description: "Place your tower",
			showGo: false,
		});

		// Wait for either countdown to finish or all towers to be placed
		await Promise.race([
			countdownPromise,
			new Promise<void>((resolve) => {
				const checkInterval = task.spawn(() => {
					while (!this.allPlayersPlacedTowers()) task.wait(0.1);
					Events.announcer.clearCountdown.broadcast();
					resolve();
				});
				this.obliterator.Add(checkInterval);
			}),
		]);

		this.setupTowers();
		destroyGizmos();
		await this.dropNonBuilders();
		const allBallGizmosDestroyed = this.giveBallGizmos();

		// Wait until either timer expires or only one player remains
		while (this.playersInChallenge.size() > 1) task.wait(0.5);

		this.playersToTowers.forEach((tower) => {
			tower.Destroy();
		});
	}

	private setupTowers() {
		CollectionService.GetTagged("block-tower").forEach((tower) => {
			const userId = tower.GetAttribute("owner");
			if (userId === undefined) return;
			const owner = Players.GetPlayerByUserId(userId as number);
			if (owner === undefined) return;

			tower.SetAttribute("touchEnabled", true);

			this.playersToTowers.set(owner, tower as BlockTower);

			tower.GetAttributeChangedSignal("dropped").Connect(() => {
				if (!tower.GetAttribute("dropped")) return;

				this.changePlatformState(owner, "eliminated");
				this.playersToTowers.delete(owner);
				task.wait(2);
				this.dropCharacter(owner.Character as CharacterRigR6);
			});
		});
	}

	private async dropNonBuilders() {
		await Promise.all(
			this.playersInChallenge.map(async (player) => {
				if (!this.playersToTowers.has(player)) await this.dropCharacter(player.Character as CharacterRigR6);
			}),
		);
	}

	private giveTowerGizmos() {
		const gizmos = new Array<Gizmo>();

		this.playerToPlatform.forEach((platform, player) => {
			const gizmo = Gizmo.give(player, Tower);
			gizmo.setParentValidation(platform);
			gizmos.push(gizmo);

			this.obliterator.Add(
				CollectionService.GetInstanceAddedSignal("block-tower").Connect((tower) => {
					const ownerId = tower.GetAttribute("owner") as number;
					if (ownerId === player.UserId) {
						this.playersToTowers.set(player, tower as BlockTower);
						if (this.allPlayersPlacedTowers()) {
							Events.announcer.clearCountdown.broadcast();
						}
					}
				}),
			);
		});

		return () => {
			gizmos.forEach((gizmo) => gizmo.destroy());
			gizmos.clear();
		};
	}

	private giveBallGizmos() {
		const gizmos = new Array<Gizmo>();
		this.playersToTowers.forEach((_, player) => {
			const gizmo = Gizmo.give(player, Ball);
			gizmos.push(gizmo);
		});

		return () => {
			return gizmos.every((gizmo) => gizmo.destroyed);
		};
	}

	private allPlayersPlacedTowers(): boolean {
		return this.playersInChallenge.every((player) => this.playersToTowers.has(player));
	}
}
