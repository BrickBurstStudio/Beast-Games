import { Tower } from "server/classes/gizmos/Tower";
import { BasePlatformChallenge } from "./base-platform.challenge";
import { Gizmo } from "server/classes/Gizmo";
import { countdown } from "server/util/countdown";
import { CollectionService, Players } from "@rbxts/services";
import { Ball } from "server/classes/gizmos/Ball";
import { getCharacter } from "shared/utils/functions/getCharacter";

export class TowerChallenge extends BasePlatformChallenge {
	private readonly TOWER_PLACE_TIME = 30;
	private readonly CHALLENGE_DURATION = 60;

	protected readonly challengeName = "Tower";
	protected readonly rules = ["place your mf tower on the platform"];
	private playersToTowers = new Map<Player, BlockTower>();
	private finished = false;

	protected async main() {
		const destroyGizmos = this.giveTowerGizmos();

		await countdown({ seconds: this.TOWER_PLACE_TIME, description: "Place your tower", showGo: false });

		this.setupTowers();

		destroyGizmos();

		await this.dropNonBuilders();

		this.giveBallGizmos();

		countdown({ seconds: this.CHALLENGE_DURATION, description: "ENDING IN", showGo: false }).then(() => {
			this.finished = true;
		});

		while (!this.finished) {
			if (this.playersInChallenge.size() === 1) {
				this.finished = true;
				break;
			}
			task.wait(0.5);
		}
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
				this.dropPlayer(owner);
			});
		});
	}

	private async dropNonBuilders() {
		await Promise.all(
			this.playersInChallenge.map(async (player) => {
				if (!this.playersToTowers.has(player)) await this.dropPlayer(player);
			}),
		);
	}

	private giveTowerGizmos() {
		const gizmos: Gizmo[] = [];
		this.playerToPlatform.forEach((platform, player) => {
			const gizmo = Gizmo.give(player, Tower);
			gizmo.setParentValidation(platform);
			gizmos.push(gizmo);
		});

		return () => {
			gizmos.forEach((gizmo) => {
				gizmo.destroy();
			});
		};
	}

	private giveBallGizmos() {
		this.playersToTowers.forEach((_, player) => {
			Gizmo.give(player, Ball);
		});
	}
}
