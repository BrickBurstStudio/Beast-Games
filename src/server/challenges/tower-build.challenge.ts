import { CharacterRigR6 } from "@rbxts/promise-character";
import { Events } from "server/network";
import { BasePlatformChallenge } from "./base-platform.challenge";

const BLOCK_SIZE = new Vector3(3, 1, 3);
const MOVE_SPEED = .25;
const REQUIRED_BLOCKS = 10;

export class TowerBuildChallenge extends BasePlatformChallenge {
	protected readonly challengeName = "Build a Tower";
	protected readonly rules = [
		"Stack blocks to build a tower",
		"Click to stop the moving block",
		"Stack must be aligned with the block below",
		`Stack ${REQUIRED_BLOCKS} blocks to win!`,
	];

	protected playerProgress = new Map<
		Player,
		{
			currentBlock?: Part;
			stackedBlocks: Part[];
			isMoving: boolean;
			moveDirection: Vector3;
		}
	>();

	protected async main() {
		// Initialize progress tracking for each player
		this.playersInChallenge.forEach((player) => {
			const baseBlock = this.createBlock();
			const playerPlatform = this.playerToPlatform.get(player);
			if (!playerPlatform || !playerPlatform.PrimaryPart) return;
			baseBlock.Position = playerPlatform.PrimaryPart.Position.add(new Vector3(3, 0, 3));

			this.playerProgress.set(player, {
				currentBlock: undefined,
				stackedBlocks: [baseBlock],
				isMoving: false,
				moveDirection: new Vector3(1, 0, 0),
			});
		});

		// Start the game loop
		while (!this.isGameOver()) {
			// Handle block spawning and movement for each player
			await Promise.all(
				this.playersInChallenge.map(async (player) => {
					const progress = this.playerProgress.get(player);
					if (!progress) return;
					if (progress.isMoving || progress.stackedBlocks.size() >= REQUIRED_BLOCKS) return;

					await this.spawnNewBlockForPlayer(player);
					await this.moveBlockForPlayer(player);
				}),
			);

			// Check if any players have completed their towers
			this.playersInChallenge.forEach((player) => {
				const progress = this.playerProgress.get(player);
				if (progress && progress.stackedBlocks.size() >= REQUIRED_BLOCKS) {
					this.playersInChallenge = this.playersInChallenge.filter((p) => p !== player);
				}
			});

			task.wait();
		}

		// Handle winners and losers
		this.playersInChallenge.forEach((player) => {
			const progress = this.playerProgress.get(player);
			if (!progress || progress.stackedBlocks.size() < REQUIRED_BLOCKS) {
				this.dropCharacter(player.Character as CharacterRigR6);
			}
		});
	}

	private createBlock(): Part {
		const block = new Instance("Part");
		block.Anchored = true;
		block.Size = BLOCK_SIZE;
		block.BrickColor = new BrickColor("White");
		// block.Material = Enum.Material.Neon;
		block.Parent = this.map;
		return block;
	}

	private async spawnNewBlockForPlayer(player: Player) {
		const progress = this.playerProgress.get(player);
		if (!progress) return;

		const lastBlock = progress.stackedBlocks[progress.stackedBlocks.size() - 1];
		progress.currentBlock = this.createBlock();
		progress.currentBlock.Size = lastBlock.Size;
		progress.currentBlock.Position = lastBlock.Position.add(new Vector3(0, lastBlock.Size.Y, 0));
		progress.isMoving = true;

		// Handle click events
		const connection = Events.challenges.towerBuildChallenge.click.connect((clickingPlayer) => {
			if (clickingPlayer !== player) return;
			if (!progress.currentBlock || !progress.isMoving) return;
			progress.isMoving = false;

			const overlap = this.calculateOverlap(
				progress.currentBlock,
				progress.stackedBlocks,
				progress.moveDirection,
			);
			if (overlap <= 0) {
				progress.currentBlock.Destroy();
				this.dropCharacter(player.Character as CharacterRigR6);
			} else {
				// Trim the block to the overlap size
				progress.currentBlock.Size = new Vector3(overlap, lastBlock.Size.Y, lastBlock.Size.Z);
				progress.currentBlock.Position = progress.currentBlock.Position.add(
					progress.moveDirection.mul(-(lastBlock.Size.X - overlap) / 2),
				);
				progress.currentBlock.Anchored = true;
				progress.stackedBlocks.push(progress.currentBlock);

				// Switch movement direction
				progress.moveDirection =
					progress.moveDirection === new Vector3(1, 0, 0) ? new Vector3(0, 0, 1) : new Vector3(1, 0, 0);
			}
			connection.Disconnect();
		});
	}

	private async moveBlockForPlayer(player: Player) {
		const progress = this.playerProgress.get(player);
		if (!progress) return;

		while (progress.isMoving && progress.currentBlock) {
			const movement = progress.moveDirection.mul(MOVE_SPEED);
			progress.currentBlock.Position = progress.currentBlock.Position.add(movement);

			// Check if the block has reached the boundary and reverse direction
			const currentPos = progress.currentBlock.Position;
			const lastBlock = progress.stackedBlocks[progress.stackedBlocks.size() - 1];
			const boundary = 5; // Define the range boundary

			if (progress.moveDirection.X !== 0) {
				if (math.abs(currentPos.X - lastBlock.Position.X) > boundary) {
					progress.moveDirection = progress.moveDirection.mul(-1);
				}
			} else if (progress.moveDirection.Z !== 0) {
				if (math.abs(currentPos.Z - lastBlock.Position.Z) > boundary) {
					progress.moveDirection = progress.moveDirection.mul(-1);
				}
			}

			task.wait(1 / 60);
		}
	}

	private calculateOverlap(currentBlock: Part, stackedBlocks: Part[], moveDirection: Vector3): number {
		if (!currentBlock) return 0;
		const lastBlock = stackedBlocks[stackedBlocks.size() - 1];

		const currentPos = currentBlock.Position;
		const lastPos = lastBlock.Position;

		if (moveDirection === new Vector3(1, 0, 0)) {
			return BLOCK_SIZE.X - math.abs(currentPos.X - lastPos.X);
		} else {
			return BLOCK_SIZE.Z - math.abs(currentPos.Z - lastPos.Z);
		}
	}

	private isGameOver(): boolean {
		for (const player of this.playersInChallenge) {
			const progress = this.playerProgress.get(player);
			if (progress && progress.stackedBlocks.size() < REQUIRED_BLOCKS) {
				return false; // At least one player is still in the challenge
			}
		}
		return true; // All players have either died or finished the challenge
	}
}
