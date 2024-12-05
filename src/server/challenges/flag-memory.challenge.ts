import { ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";
import Make from "@rbxts/make";
import { Gizmo } from "server/classes/Gizmo";
import { Place } from "server/classes/gizmos/Place";
import { countdown } from "server/util/countdown";

export class FlagMemoryChallenge extends BaseChallenge {
	private FLAG_SPAWN_RADIUS = 20;
	protected map = ServerStorage.ChallengeMaps.FlagMemoryChallenge.Clone();
	protected challengeName = "Flag Memory" as const;
	protected rules: string[] = [];
	private playerPlacements: Map<Player, Vector3[]> = new Map();
	private points: CFrame[] = [];

	protected async main() {
		const flags: Model[] = [];
		this.points = this.generatePoints();
		this.points.forEach((point) => {
			const flag = this.placeFlag(point);
			flags.push(flag);
			Make("Highlight", {
				Parent: flag,
			});
		});

		await countdown({
			seconds: 15,
			description: "Memorize the flags!",
		});

		flags.forEach((flag) => {
			flag.Parent = undefined;
		});

		const gizmos = this.setupGizmos();

		await countdown({
			seconds: 30,
			description: "Place your flags!",
			showGo: false,
		});

		gizmos.forEach((gizmo) => {
			gizmo.tool.Destroy();
			gizmo.destroy();
		});

		flags.forEach((flag) => {
			flag.Parent = this.map;
		});

		const winner = this.playersInChallenge
			.map((player) => ({
				player,
				score: this.calculateScore(player),
			}))
			.reduce((best, current) => (current.score < best.score ? current : best)).player;

		this.playersInChallenge = [winner];
	}

	private calculateScore(player: Player) {
		const placements = this.playerPlacements.get(player);
		if (!placements) return math.huge;

		const sum = placements.reduce((acc, curr) => acc.add(curr), new Vector3());
		const pointsSum = this.points.reduce((acc, curr) => acc.add(curr.Position), new Vector3());

		return sum.div(placements.size()).sub(pointsSum.div(this.points.size())).Magnitude;
	}

	private placeFlag(point: CFrame) {
		const flag = ReplicatedStorage.Assets.Objects.FlagPole.Clone();
		flag.PivotTo(
			point.mul(
				flag
					.GetPivot()
					.sub(flag.GetPivot().Position)
					.add(new Vector3(0, flag.Pole.Size.X / 2 - 0.5, 0)),
			),
		);
		flag.Parent = this.map;
		return flag;
	}

	protected setupGizmos() {
		const gizmos: Gizmo[] = [];
		this.playersInChallenge.forEach((player) => {
			const place = Gizmo.give(player, Place);
			gizmos.push(place);
			place.placePosition.Event.Connect((player: Player, position: Vector3) => {
				const placements = this.playerPlacements.get(player);
				if (placements !== undefined && placements.size() >= this.points.size()) return;

				if (placements) placements.push(position);
				else this.playerPlacements.set(player, [position]);
				this.placeFlag(new CFrame(position));
			});
		});
		return gizmos;
	}

	protected generatePoints() {
		return (this.map.Centers.GetChildren() as Part[]).map((center) =>
			this.getRandomPositionAroundPoint(center.Position, this.FLAG_SPAWN_RADIUS),
		);
	}

	protected getRandomPositionAroundPoint(sourcePosition: Vector3, radius: number) {
		const randomAngle = math.random() * 2 * math.pi;
		const x = sourcePosition.X + radius * math.cos(randomAngle);
		const z = sourcePosition.Z + radius * math.sin(randomAngle);

		return new CFrame(new Vector3(x, sourcePosition.Y, z));
	}
	protected spawnCharacter({ player, character, i }: SpawnCharacterArgs): void {
		const spawn = this.map.Spawn;
		const radius = 10; // Adjust radius as needed
		const angle = (i * 2 * math.pi) / this.playersInChallenge.size();

		const x = spawn.Position.X + radius * math.cos(angle);
		const z = spawn.Position.Z + radius * math.sin(angle);

		character.PivotTo(new CFrame(new Vector3(x, spawn.Position.Y, z).add(new Vector3(0, 2, 0))));
	}
}
