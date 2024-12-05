import Object from "@rbxts/object-utils";
import { Players, ServerStorage } from "@rbxts/services";
import { Gizmo } from "server/classes/Gizmo";
import { Pugil } from "server/classes/gizmos/Pugil";
import { Events } from "server/network";
import { store } from "server/store";
import { announce } from "server/util/announce";
import { countdown } from "server/util/countdown";
import { KING_OF_HILL_CONFIG } from "shared/configs/challenges/king-of-hill";
import { getCharacter } from "shared/utils/functions/getCharacter";
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

	private readonly ROUND_TIME = KING_OF_HILL_CONFIG.ROUND_TIME;
	private readonly POINTS_PER_SECOND = KING_OF_HILL_CONFIG.POINTS_PER_SECOND;
	private readonly TARGET_SCORE = KING_OF_HILL_CONFIG.TARGET_SCORE;
	private readonly SCORE_UPDATE_INTERVAL = KING_OF_HILL_CONFIG.SCORE_UPDATE_INTERVAL;

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
		});

		// Set up hill detection
		this.setupHillDetection();

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

		// Get the hill's world position
		const hillPosition = hillPlatform.Position;

		// Create spawn CFrame at world position
		character.HumanoidRootPart.CFrame = new CFrame(
			hillPosition.X,
			hillPosition.Y + hillPlatform.Size.Y / 2 + 5, // Spawn slightly above the platform
			hillPosition.Z,
		).mul(CFrame.Angles(0, -angle, 0)); // Face towards the hill
	}

	private setupHillDetection() {
		const hillPlatform = this.map.Hill.Top;
		const HILL_RADIUS = hillPlatform.Size.Z / 2; // Distance in studs

		// Run the check periodically
		this.obliterator.Add(
			task.spawn(async () => {
				while (true) {
					for (const player of this.playersInChallenge) {
						const character = await getCharacter(player);
						if (!character) continue;

						const rootPart = character.HumanoidRootPart;
						if (!rootPart) continue;

						const distance = rootPart.Position.sub(hillPlatform.Position).Magnitude;

						if (distance <= HILL_RADIUS) {
							if (!this.hillOccupants.has(player)) {
								this.hillOccupants.add(player);
							}
						} else {
							if (this.hillOccupants.has(player)) {
								this.hillOccupants.delete(player);
							}
						}
					}
					task.wait(1);
				}
			}),
		);
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
		await Promise.all(
			this.playersInChallenge.map(async (player) => {
				if (!this.advancedPlayers.has(player)) {
					player.SetAttribute("lives", 0);
					if (player.Character) {
						const character = await getCharacter(player);
						character.Humanoid.Health = 0;
					}
				}
			}),
		);
	}

	private getSortedPlayersByScore() {
		return Object.entries(this.playerScores)
			.sort(([, a], [, b]) => !!(b - a))
			.map(([player]) => player);
	}

	private broadcastScores() {
		const scores = new Map<string, number>();
		this.playerScores.forEach((score, player) => {
			scores.set(player.DisplayName, score);
		});
		Events.challenges.kingOfHillChallenge.updateScores.broadcast(scores);
	}
}
