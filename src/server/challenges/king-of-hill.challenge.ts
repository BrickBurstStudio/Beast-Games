import Object from "@rbxts/object-utils";
import { Players, ServerStorage } from "@rbxts/services";
import { Gizmo } from "server/classes/Gizmo";
import { Pugil } from "server/classes/gizmos/Pugil";
import { Events } from "server/network";
import { announce } from "server/util/announce";
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

	protected challengeDuration = 60 * 2;
	private readonly POINTS_PER_SECOND = KING_OF_HILL_CONFIG.POINTS_PER_SECOND;
	private readonly TARGET_SCORE = KING_OF_HILL_CONFIG.TARGET_SCORE;
	private readonly SCORE_UPDATE_INTERVAL = KING_OF_HILL_CONFIG.SCORE_UPDATE_INTERVAL;

	private playerScores = new Map<Player, number>();
	private hillOccupants = new Set<Player>();
	private advancedPlayers = new Set<Player>();

	protected async main() {
		// Initialize scores
		this.playersInChallenge.forEach((player) => {
			this.playerScores.set(player, 0);
			Gizmo.give(player, Pugil);
		});

		this.setupHillDetection();
		await this.enablePlayerMovement();

		// Main game loop
		while (true) {
			this.hillOccupants.forEach((player) => {
				const currentScore = this.playerScores.get(player) ?? 0;
				const newScore = currentScore + this.POINTS_PER_SECOND * this.SCORE_UPDATE_INTERVAL;
				this.playerScores.set(player, newScore);

				if (newScore >= this.TARGET_SCORE && !this.advancedPlayers.has(player)) {
					this.handlePlayerAdvance(player);
				}
			});

			this.broadcastScores();

			if (this.advancedPlayers.size() >= 2) {
				break;
			}

			task.wait(this.SCORE_UPDATE_INTERVAL);
		}

		await this.eliminateRemainingPlayers();
	}

	protected async onTimerExpired() {
		const sortedPlayers = this.getSortedPlayersByScore().filter((_, i) => i < 2);
		for (const player of sortedPlayers) {
			await this.handlePlayerAdvance(player);
		}
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

		this.obliterator.Add(
			hillPlatform.Touched.Connect((part) => {
				const player = Players.GetPlayerFromCharacter(part.Parent);
				if (!player || !this.playersInChallenge.includes(player)) return;
				this.hillOccupants.add(player);
			}),
			"Disconnect",
		);

		this.obliterator.Add(
			hillPlatform.TouchEnded.Connect((part) => {
				const player = Players.GetPlayerFromCharacter(part.Parent);
				if (!player) return;
				this.hillOccupants.delete(player);
			}),
			"Disconnect",
		);
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
