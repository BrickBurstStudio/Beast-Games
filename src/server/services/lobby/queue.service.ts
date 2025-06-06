import { OnStart, Service } from "@flamework/core";
import { AnalyticsService, CollectionService, Players, TeleportService } from "@rbxts/services";
import { Events } from "server/network";
import { cancelCountdown, countdown } from "server/util/countdown";
import { LOBBY_PLACE_ID, MAIN_PLACE_ID } from "shared/configs/places";
import { QUEUE_CONFIG } from "shared/configs/queue";
import createForcefield from "shared/utils/functions/createForcefield";
import { getCharacter } from "shared/utils/functions/getCharacter";

interface QueueState {
	startTime: number;
	countdownEndTime?: number;
}

@Service()
export class QueueService implements OnStart {
	private readonly MIN_PLAYERS = QUEUE_CONFIG.MIN_PLAYERS; // Minimum players to start a match
	private readonly MAX_QUEUE_WAIT_TIME = QUEUE_CONFIG.MAX_QUEUE_WAIT_TIME; // Maximum time (in seconds) before forcing a match with available players
	private readonly MAX_PLAYERS = QUEUE_CONFIG.MAX_PLAYERS; // Add this line after line 19

	private queueState: QueueState = {
		startTime: 0,
	};

	private getPlayersInQueue(): Player[] {
		return Players.GetPlayers().filter((player) => player.GetAttribute("inQueue") === true);
	}

	onStart() {
		if (game.PlaceId !== LOBBY_PLACE_ID) return;

		const queueBox = CollectionService.GetTagged("queue")[0] as Model;
		const forcefield = createForcefield(queueBox.PrimaryPart!);

		this.setupQueueEvents(forcefield);
		this.handlePlayerRemoving();

		// TODO: This is a temporary solution to update the queue UI fix the root problem
		// Add periodic queue state verification
		task.spawn(() => {
			while (true) {
				this.broadcastQueueUpdate();
				task.wait(5); // Verify every 5 seconds
			}
		});

		// Add match start checker loop
		task.spawn(() => {
			while (true) {
				if (this.shouldStartMatch()) {
					this.startMatch();
				}
				task.wait(0.5);
			}
		});
	}

	private setupQueueEvents(forcefield: Part) {
		Events.exitQueue.connect((player) => this.removePlayerFromQueue(player, forcefield));

		forcefield.GetChildren().forEach((child) => {
			if (!child.IsA("Part")) return;
			(child as Part).Touched.Connect(async (otherPart) => {
				const player = Players.GetPlayerFromCharacter(otherPart.Parent);
				if (!player || player.GetAttribute("inQueue")) return;

				this.addPlayerToQueue(player, forcefield);
			});
		});
	}

	private async addPlayerToQueue(player: Player, forcefield: Part) {
		const playersInQueue = this.getPlayersInQueue();

		if (playersInQueue.size() >= this.MAX_PLAYERS) {
			Events.announcer.announce.fire(player, ["Queue is full! Please try again later."]);
			return;
		}

		const character = await getCharacter(player);
		character.PivotTo(forcefield.CFrame.mul(new CFrame(0, -forcefield.Size.Y / 2, 0)));

		player.SetAttribute("inQueue", true);

		playersInQueue.push(player);

		AnalyticsService.LogOnboardingFunnelStepEvent(player, 2, "entered_queue");

		AnalyticsService.LogFunnelStepEvent(player, "Core Loop", `${player.UserId}-${game.JobId}`, 2, "entered_queue");

		if (playersInQueue.size() === this.MIN_PLAYERS) {
			// Start countdown when minimum players is reached
			this.queueState.startTime = tick();
			this.queueState.countdownEndTime = this.queueState.startTime + this.MAX_QUEUE_WAIT_TIME;

			// Start countdown for all players in queue
			playersInQueue.forEach((queuedPlayer) => {
				try {
					countdown({
						seconds: this.MAX_QUEUE_WAIT_TIME,
						description: "Match starting in...",
						player: queuedPlayer,
					});
				} catch (error) {
					print(error);
				}
			});
		} else if (this.queueState.countdownEndTime) {
			// Show countdown to newly joined player if it's already running
			const remainingTime = math.max(0, this.queueState.countdownEndTime - tick());
			if (remainingTime > 0) {
				try {
					countdown({
						seconds: remainingTime,
						description: "Match starting in...",
						player,
					});
				} catch (error) {
					print(error);
				}
			}
		}

		this.broadcastQueueUpdate();
	}

	private async removePlayerFromQueue(player: Player, forcefield: Part) {
		if (!player.GetAttribute("inQueue")) return;

		const character = await getCharacter(player);
		character.PivotTo(forcefield.CFrame.mul(new CFrame(0, -forcefield.Size.Y / 2, forcefield.Size.Z - 35)));
		task.wait(0.05);
		player.SetAttribute("inQueue", false);

		// Check if we need to cancel countdown due to insufficient players
		if (this.queueState.countdownEndTime && this.getPlayersInQueue().size() < this.MIN_PLAYERS) {
			try {
				cancelCountdown(player);
			} catch (error) {
				print(error);
			}
			this.queueState.countdownEndTime = undefined;
		}

		try {
			cancelCountdown();
		} catch (error) {
			print(error);
		}
		this.broadcastQueueUpdate();
	}

	private handlePlayerRemoving() {
		Players.PlayerRemoving.Connect((player) => {
			if (player.GetAttribute("inQueue")) {
				player.SetAttribute("inQueue", false);
				this.broadcastQueueUpdate();
			}
		});
	}

	private shouldStartMatch(): boolean {
		const playersInQueue = this.getPlayersInQueue();
		const currentTime = tick();

		return (
			playersInQueue.size() >= this.MIN_PLAYERS &&
			this.queueState.countdownEndTime !== undefined &&
			currentTime >= this.queueState.countdownEndTime
		);
	}

	private async startMatch() {
		try {
			const playersInQueue = this.getPlayersInQueue();

			if (playersInQueue.size() < this.MIN_PLAYERS) {
				playersInQueue.forEach((player) => {
					Events.announcer.announce.fire(player, [
						"Not enough players to start match. Waiting for more players...",
					]);
				});
				try {
					cancelCountdown();
				} catch (error) {
					print(error);
				}
				this.queueState.countdownEndTime = undefined;
				return;
			}

			// Reset queue state before teleporting to prevent edge cases
			this.queueState.countdownEndTime = undefined;

			TeleportService.TeleportAsync(MAIN_PLACE_ID, playersInQueue);

			playersInQueue.forEach((player) => {
				AnalyticsService.LogOnboardingFunnelStepEvent(player, 3, "teleported");
				AnalyticsService.LogFunnelStepEvent(
					player,
					"Core Loop",
					`${player.UserId}-${game.JobId}`,
					3,
					"teleported",
				);
			});
		} catch (error) {
			const playersInQueue = this.getPlayersInQueue();
			playersInQueue.forEach((player) => {
				try {
					cancelCountdown(player);
				} catch (error) {
					print(error);
				}
			});
			this.queueState.countdownEndTime = undefined;
			print(error);
		} finally {
			this.broadcastQueueUpdate();
		}
	}

	private broadcastQueueUpdate() {
		Events.updateQueue.broadcast(this.getPlayersInQueue().size());
	}
}
