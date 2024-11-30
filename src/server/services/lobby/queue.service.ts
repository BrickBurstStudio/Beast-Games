import { OnStart, Service } from "@flamework/core";
import { AnalyticsService, CollectionService, Players, TeleportService, Workspace } from "@rbxts/services";
import { Events } from "server/network";
import { LOBBY_PLACE_ID, MAIN_PLACE_ID } from "shared/configs/places";
import createForcefield from "shared/utils/functions/createForcefield";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { QUEUE_CONFIG } from "shared/configs/queue";

interface QueueState {
	startTime: number;
	isMatchmaking: boolean;
	countdownEndTime?: number;
}

@Service()
export class QueueService implements OnStart {
	private readonly QUEUE_CHECK_INTERVAL = 0.5; // Check queue every half second
	private readonly MIN_PLAYERS = QUEUE_CONFIG.MIN_PLAYERS; // Minimum players to start a match
	private readonly MAX_QUEUE_WAIT_TIME = QUEUE_CONFIG.MAX_QUEUE_WAIT_TIME; // Maximum time (in seconds) before forcing a match with available players

	private queueState: QueueState = {
		startTime: 0,
		isMatchmaking: false,
	};

	private getPlayersInQueue(): Player[] {
		return Players.GetPlayers().filter((player) => player.GetAttribute("inQueue") === true);
	}

	onStart() {
		if (game.PlaceId !== LOBBY_PLACE_ID) return;

		const queueBox = CollectionService.GetTagged("queue")[0] as Model;
		const forcefield = createForcefield(queueBox.PrimaryPart!);

		this.setupQueueEvents(forcefield);
		this.startQueueProcessor();
		this.handlePlayerRemoving();
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
		const character = await getCharacter(player);
		character.PivotTo(forcefield.CFrame.mul(new CFrame(0, -forcefield.Size.Y / 2, 0)));
		player.SetAttribute("inQueue", true);

		AnalyticsService.LogOnboardingFunnelStepEvent(player, 2, "entered_queue");
		AnalyticsService.LogFunnelStepEvent(player, "core_loop", `${player.UserId}-${game.JobId}`, 2, "entered_queue");
		const playersInQueue = this.getPlayersInQueue();
		if (playersInQueue.size() === this.MIN_PLAYERS) {
			// Start countdown when minimum players is reached
			this.queueState.startTime = tick();
			this.queueState.countdownEndTime = tick() + this.MAX_QUEUE_WAIT_TIME;

			// Start countdown for all players in queue
			playersInQueue.forEach((queuedPlayer) => {
				Events.announcer.countdown.fire(queuedPlayer, {
					seconds: this.MAX_QUEUE_WAIT_TIME,
					description: "Match starting in...",
				});
			});
		} else if (this.queueState.countdownEndTime) {
			// Show countdown to newly joined player if it's already running
			const remainingTime = math.max(0, this.queueState.countdownEndTime - tick());
			if (remainingTime > 0) {
				Events.announcer.countdown.fire(player, {
					seconds: remainingTime,
					description: "Match starting in...",
				});
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
			Events.announcer.clearCountdown.broadcast();
			this.queueState.countdownEndTime = undefined;
		}

		Events.announcer.clearCountdown.fire(player);
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

	private startQueueProcessor() {
		while (true) {
			task.wait(this.QUEUE_CHECK_INTERVAL);

			const playersInQueue = this.getPlayersInQueue();
			if (this.queueState.isMatchmaking || playersInQueue.size() < this.MIN_PLAYERS) {
				continue;
			}

			const currentTime = tick();
			const queueDuration = currentTime - this.queueState.startTime;
			const shouldStartMatch = this.shouldStartMatch(queueDuration);

			if (shouldStartMatch) {
				this.startMatch();
			}
		}
	}

	private shouldStartMatch(queueDuration: number): boolean {
		const playersInQueue = this.getPlayersInQueue();
		return (
			playersInQueue.size() >= this.MIN_PLAYERS &&
			queueDuration >= this.MAX_QUEUE_WAIT_TIME &&
			!this.queueState.isMatchmaking
		);
	}

	private async startMatch() {
		this.queueState.isMatchmaking = true;

		try {
			task.wait(this.MAX_QUEUE_WAIT_TIME);

			const playersInQueue = this.getPlayersInQueue();

			if (playersInQueue.size() < this.MIN_PLAYERS) {
				playersInQueue.forEach((player) => {
					Events.announcer.announce.fire(player, [
						"Not enough players to start match. Waiting for more players...",
					]);
				});
				Events.announcer.clearCountdown.broadcast();
				this.queueState.countdownEndTime = undefined;
				this.queueState.isMatchmaking = false;
				return;
			}

			TeleportService.TeleportAsync(MAIN_PLACE_ID, playersInQueue);

			playersInQueue.forEach((player) => {
				AnalyticsService.LogOnboardingFunnelStepEvent(player, 3, "teleported");
				AnalyticsService.LogFunnelStepEvent(
					player,
					"core_loop",
					`${player.UserId}-${game.JobId}`,
					3,
					"teleported",
				);
			});
		} catch (error) {
			const playersInQueue = this.getPlayersInQueue();
			playersInQueue.forEach((player) => Events.announcer.clearCountdown.fire(player));
			this.queueState.countdownEndTime = undefined;
		}

		this.queueState.isMatchmaking = false;
		this.broadcastQueueUpdate();
	}

	private broadcastQueueUpdate() {
		Events.updateQueue.broadcast(this.getPlayersInQueue().size());
	}
}
