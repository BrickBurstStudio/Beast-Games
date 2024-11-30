import Object from "@rbxts/object-utils";
import { Players, ServerStorage } from "@rbxts/services";
import { Gizmo } from "server/classes/Gizmo";
import { Pugil } from "server/classes/gizmos/Pugil";
import { Events } from "server/network";
import { store } from "server/store";
import { announce } from "server/util/announce";
import { countdown } from "server/util/countdown";
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";

export class KingOfHillChallenge extends BaseChallenge {
	protected readonly map = ServerStorage.ChallengeMaps.KingOfTheHillChallenge.Clone();
	protected readonly challengeName = "King of the Hill";
	protected readonly rules = [
		"Stand on the center platform to earn points",
		"Use your pugil stick to knock other players off",
		"First two players to reach the target score advance",
		"Everyone else will be eliminated",
	];

	private readonly ROUND_TIME = 120; // 2 minutes
	private readonly POINTS_PER_SECOND = 10;
	private readonly TARGET_SCORE = 1000;
	private readonly SCORE_UPDATE_INTERVAL = 0.1;

	private playerScores = new Map<Player, number>();
	private hillOccupants = new Set<Player>();
	private finished = false;
	private advancedPlayers = new Set<Player>();

	protected async main() {
		// Initialize scores
		this.playersInChallenge.forEach((player) => {
			this.playerScores.set(player, 0);
			// Give each player a pugil
			const pugil = Gizmo.give(player, Pugil);
			// Set hit validator to allow hitting any other player
			pugil.setHitValidator((character) => {
				const hitPlayer = Players.GetPlayerFromCharacter(character);
				if (!hitPlayer) return false;
				return hitPlayer !== player && this.playersInChallenge.includes(hitPlayer);
			});
		});

		// Set up hill detection
		this.setupHillDetection();

		// Start the round
		await countdown({
			seconds: 3,
			description: "Get ready to climb!",
		});

		// Enable player movement
		await this.enablePlayerMovement();

		// Start the main game loop
		const mainLoop = this.startGameLoop();
		const timeLimit = this.startTimeLimit();

		// Wait for either win condition or time limit
		await Promise.race([mainLoop, timeLimit]);

		// Handle players who didn't advance
		await this.eliminateRemainingPlayers();

		store.setChallenge(undefined);
	}

	protected spawnCharacter({ character }: SpawnCharacterArgs): void {
		const hillPlatform = this.map.Hill.PrimaryPart!;
		const spawnRadius = 20; // Distance from the hill center to spawn players

		// Calculate random angle for circular distribution
		const angle = math.rad(math.random(0, 360));

		// Calculate spawn position using polar coordinates
		const spawnX = math.cos(angle) * spawnRadius;
		const spawnZ = math.sin(angle) * spawnRadius;

		// Position the character relative to the hill
		character.HumanoidRootPart.CFrame = hillPlatform.CFrame.mul(
			new CFrame(
				spawnX,
				hillPlatform.Size.Y / 2 + 5, // Spawn slightly above the platform
				spawnZ,
			),
		).mul(CFrame.Angles(0, -angle, 0)); // Face towards the hill
	}

	private setupHillDetection() {
		const hillPlatform = this.map.Hill.PrimaryPart!;

		hillPlatform.Touched.Connect((part) => {
			const player = Players.GetPlayerFromCharacter(part.Parent);
			if (!player || !this.playersInChallenge.includes(player)) return;
			this.hillOccupants.add(player);
		});

		hillPlatform.TouchEnded.Connect((part) => {
			const player = Players.GetPlayerFromCharacter(part.Parent);
			if (!player) return;
			this.hillOccupants.delete(player);
		});
	}

	private async startGameLoop() {
		while (!this.finished) {
			// Award points to players on hill
			this.hillOccupants.forEach((player) => {
				const currentScore = this.playerScores.get(player) ?? 0;
				const newScore = currentScore + this.POINTS_PER_SECOND * this.SCORE_UPDATE_INTERVAL;
				this.playerScores.set(player, newScore);

				// Check for winners
				if (newScore >= this.TARGET_SCORE && !this.advancedPlayers.has(player)) {
					this.handlePlayerAdvance(player);
				}
			});

			// Update UI with current scores
			this.broadcastScores();

			// Check if we have our 2 winners
			if (this.advancedPlayers.size() >= 2) {
				this.finished = true;
				break;
			}

			task.wait(this.SCORE_UPDATE_INTERVAL);
		}
	}

	private async startTimeLimit() {
		await countdown({
			seconds: this.ROUND_TIME,
			description: "Time Remaining",
		});

		// If time runs out, advance top 2 scoring players
		if (!this.finished) {
			const sortedPlayers = this.getSortedPlayersByScore().filter((_, i) => i < 2);
			for (const player of sortedPlayers) {
				await this.handlePlayerAdvance(player);
			}
			this.finished = true;
		}
	}

	private async handlePlayerAdvance(player: Player) {
		this.advancedPlayers.add(player);
		await announce([`${player.Name} has advanced!`]);
	}

	private async eliminateRemainingPlayers() {
		this.playersInChallenge = this.playersInChallenge.filter((player) => !this.advancedPlayers.has(player));
	}

	private getSortedPlayersByScore() {
		return Object.entries(this.playerScores)
			.sort(([, a], [, b]) => !!(b - a))
			.map(([player]) => player);
	}

	private broadcastScores() {
		const scores = new Map<string, number>();
		this.playerScores.forEach((score, player) => {
			scores.set(player.Name, score);
		});
		Events.challenges.kingOfHillChallenge.updateScores.broadcast(scores);
	}
}
