import { CharacterRigR6 } from "@rbxts/promise-character";
import { ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { Events } from "server/network";
import { announce } from "server/util/announce";
import { countdown } from "server/util/countdown";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { BaseChallenge } from "./base.challenge";

const MEMORIZE_TIME = 10;
const PLACEMENT_TIME = 30;
const PLAYERS_PER_ROUND = 3;
const FLAGS_PER_PLAYER = 3;
const SCORE_THRESHOLD = 75; // Score percentage needed to advance

interface FlagData {
	model: Model;
	position: Vector3;
	rotation: number;
}

export class FlagMemoryChallenge extends BaseChallenge {
	protected readonly challengeName = "Flag Memory" as const;
	protected readonly rules = [
		"Three players will compete at a time",
		"Memorize the positions of the flags",
		"Place your flags as close as possible to the original positions",
		"Players with the highest accuracy will advance",
		`You need ${SCORE_THRESHOLD}% accuracy to advance`,
	];
	protected readonly map = ServerStorage.ChallengeMaps.FlagMemoryChallenge.Clone();

	private targetFlags: FlagData[] = [];
	private playerFlags: Map<Player, FlagData[]> = new Map();
	private currentGroup: Player[] = [];
	private playerScores: Map<Player, number> = new Map();

	protected async main() {
		while (this.playersInChallenge.size() > 0) {
			// Select next group of players
			this.currentGroup = this.playersInChallenge.filter((_, i) => i < PLAYERS_PER_ROUND);
			this.playersInChallenge = this.playersInChallenge.filter((p) => !this.currentGroup.includes(p));

			await this.runRound();
			await this.evaluateScores();
			this.cleanup();
		}
	}

	private async runRound() {
		// Spawn target flags
		this.spawnTargetFlags();

		// Show flags and start memorization phase
		await announce(["Memorize the flag positions!"]);
		await countdown({ seconds: MEMORIZE_TIME, description: "Memorize Time" });

		// Hide target flags
		this.targetFlags.forEach((flag) => flag.model.Destroy());

		// Give players their flags and let them place them
		await this.startPlacementPhase();
	}

	private spawnTargetFlags() {
		for (let i = 0; i < FLAGS_PER_PLAYER; i++) {
			const flag = ReplicatedStorage.Assets.Objects.FlagPole.Clone();
			const position = this.getRandomPosition();
			const rotation = math.random(0, 360);

			flag.PivotTo(new CFrame(position).mul(CFrame.Angles(0, math.rad(rotation), 0)));
			flag.Parent = this.map;

			this.targetFlags.push({
				model: flag,
				position: position,
				rotation: rotation,
			});
		}
	}

	private async startPlacementPhase() {
		// Give each player their flags
		this.currentGroup.forEach((player) => {
			const playerFlagData: FlagData[] = [];
			for (let i = 0; i < FLAGS_PER_PLAYER; i++) {
				const flag = ReplicatedStorage.Assets.Objects.FlagPole.Clone();
				flag.Parent = this.map;
				playerFlagData.push({
					model: flag,
					position: new Vector3(),
					rotation: 0,
				});
			}
			this.playerFlags.set(player, playerFlagData);
		});

		// Set up flag placement handler
		const connection = Events.challenges.flagMemoryChallenge.placeFlag.connect(
			(player, flagIndex, position, rotation) => {
				const playerFlags = this.playerFlags.get(player);
				if (!playerFlags || !this.currentGroup.includes(player)) return;

				const flagData = playerFlags[flagIndex];
				if (!flagData) return;

				flagData.position = position;
				flagData.rotation = rotation;
				flagData.model.PivotTo(new CFrame(position).mul(CFrame.Angles(0, math.rad(rotation), 0)));
			},
		);
		this.obliterator.Add(connection);

		// Start placement phase
		Events.challenges.flagMemoryChallenge.startPlacement.broadcast();
		await countdown({ seconds: PLACEMENT_TIME, description: "Place your flags!" });
		Events.challenges.flagMemoryChallenge.endPlacement.broadcast();
	}

	private async evaluateScores() {
		this.currentGroup.forEach((player) => {
			const playerFlags = this.playerFlags.get(player);
			if (!playerFlags) return;

			let totalScore = 0;
			this.targetFlags.forEach((targetFlag, index) => {
				const playerFlag = playerFlags[index];
				const distance = targetFlag.position.sub(playerFlag.position).Magnitude;
				const rotationDiff = math.abs(targetFlag.rotation - playerFlag.rotation);

				// Calculate score based on distance and rotation (0-100)
				const distanceScore = math.clamp(100 - distance * 10, 0, 100);
				const rotationScore = math.clamp(100 - rotationDiff / 3.6, 0, 100);

				totalScore += distanceScore * 0.7 + rotationScore * 0.3;
			});

			const finalScore = totalScore / FLAGS_PER_PLAYER;
			this.playerScores.set(player, finalScore);

			if (finalScore >= SCORE_THRESHOLD) {
				this.MovePlayerToEndArea(player);
			} else {
				this.eliminatePlayer(player);
			}
		});
	}

	private getRandomPosition(): Vector3 {
		const playArea = this.map.ChallengeArea.PlayArea;
		return new Vector3(
			math.random(-playArea.Size.X / 2, playArea.Size.X / 2),
			playArea.Position.Y,
			math.random(-playArea.Size.Z / 2, playArea.Size.Z / 2),
		);
	}

	private cleanup() {
		this.targetFlags = [];
		this.playerFlags.clear();
		this.currentGroup = [];
	}

	private async eliminatePlayer(player: Player) {
		const character = await getCharacter(player);
		if (!character) return;
		character.Humanoid.Health = 0;
	}

	private async MovePlayerToEndArea(player: Player) {
		const character = await getCharacter(player);
		if (!character) return;
		character.HumanoidRootPart.CFrame = this.map.ChallengeArea.EndArea.Platform.CFrame.add(new Vector3(0, 5, 0));
	}

	protected spawnCharacter({ character }: { character: CharacterRigR6 }) {
		character.HumanoidRootPart.CFrame = this.map.ChallengeArea.StartArea.Platform.CFrame.add(new Vector3(0, 5, 0));
	}
}
