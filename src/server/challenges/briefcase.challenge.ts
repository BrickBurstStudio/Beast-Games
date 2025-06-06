import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import Make from "@rbxts/make";
import { ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { cancelCountdown, countdown } from "server/util/countdown";
import { generatePlayerGrid } from "server/util/generatePlayerGrid";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { BriefcaseComponent } from "../components/claim-components/briefcase.component";
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";
import { Events } from "server/network";
import { Gizmo } from "server/classes/Gizmo";
import { Push } from "server/classes/gizmos/Push";

export class BriefcaseChallenge extends BaseChallenge {
	protected readonly challengeName = "Briefcase Memory" as const;
	protected readonly rules = [
		"A random number of cases are safe.",
		"Memorize the safe cases!",
		"You must claim a safe case or be eliminated!",
	];
	protected readonly map = ServerStorage.ChallengeMaps.BriefcaseChallenge.Clone();
	readonly components = Dependency<Components>();
	readonly badBriefcases = 200;
	readonly revealTime = 5;
	readonly cellPadding = 10;
	readonly memorizeTime = 10;
	readonly runTime = 30;
	readonly playerSelections: { [key: Player["UserId"]]: BriefcaseComponent } = {};
	cases = 0;
	barrier: Part | undefined;

	briefcases: BriefcaseComponent[] = [];
	revealing = false;

	protected async main() {
		this.playersInChallenge.forEach((p) => {
			this.obliterator.Add(Gizmo.give(p, Push), "destroy");
		});

		this.RandomizeCases();

		await countdown({ seconds: 10, description: "Showing cases...", showGo: false });
		print("showing cases countdown passed");
		this.ToggleCases(true);
		await countdown({ seconds: this.revealTime, description: "Memorize...", showGo: false });
		this.ToggleCases(false);
		await countdown({ seconds: 10, description: "Race in..." });

		this.barrier?.Destroy();

		// todo: wait until time
		const t = DateTime.now().UnixTimestamp;
		countdown({ seconds: this.runTime, description: "Pick a case!", showGo: false });
		while (
			!this.playersInChallenge.every((p) => p.UserId in this.playerSelections) &&
			DateTime.now().UnixTimestamp - t < this.runTime
		)
			task.wait();

		cancelCountdown();
		task.wait(3);
		this.ToggleCases(true);
		task.wait(3);
		this.EliminatePlayers();
		task.wait(1); // to process death events, just to be safe
	}

	protected async setup() {
		this.cases = math.ceil(this.playersInChallenge.size() / 2) + this.badBriefcases;
		const grid = generatePlayerGrid(this.cases, 10);
		const largestY = this.GetLargestSubarray(grid)!;
		const gridCenterXOffset = grid.size() * (this.cellPadding / 2) - this.cellPadding / 2;
		const gridCenterYOffset = largestY.size() * (this.cellPadding / 2) - this.cellPadding / 2;

		for (let x = 0; x < grid.size(); x++) {
			for (let y = 0; y < largestY.size(); y++) {
				const briefcaseStand = ReplicatedStorage.Assets.Objects.BriefcaseStand.Clone();
				briefcaseStand.Parent = this.map;
				briefcaseStand.PivotTo(
					this.map.Baseplate.CFrame.mul(
						new CFrame(
							x * this.cellPadding - gridCenterXOffset,
							this.map.Baseplate.Size.Y / 2 + briefcaseStand.PrimaryPart!.Size.X / 2,
							y * this.cellPadding - gridCenterYOffset,
						),
					).mul(CFrame.Angles(0, 0, math.rad(-90))),
				);

				const clone = ReplicatedStorage.Assets.Objects.Briefcase.Clone();
				clone.Part.Anchored = true;
				clone.Parent = this.map.Briefcases;
				clone.Part.CFrame = new CFrame(briefcaseStand.GetPivot().Position)
					.mul(new CFrame(0, briefcaseStand.PrimaryPart!.Size.X / 2 + 0.5, 0))
					.mul(CFrame.Angles(math.rad(90), 0, 0));
			}
		}

		const carpetBase = Make("Part", {
			Parent: this.map,
			Anchored: true,
			Size: new Vector3(
				grid.size() * this.cellPadding + this.cellPadding / 2,
				0,
				largestY.size() * this.cellPadding + this.cellPadding / 2,
			),
			BrickColor: new BrickColor("Really red"),
			CFrame: this.map.Baseplate.CFrame.mul(new CFrame(0, this.map.Baseplate.Size.Y / 2 + 0.1, 0)),
		});

		const barrier = carpetBase.Clone();
		barrier.Size = barrier.Size.add(new Vector3(0, 500, 0));
		barrier.Transparency = 1;
		barrier.Parent = this.map;

		const carpetClone = carpetBase.Clone();
		carpetClone.Size = carpetClone.Size.sub(new Vector3(4, -5, 4));
		carpetClone.Parent = this.map;

		const carpet = carpetBase.SubtractAsync([carpetClone]);
		carpetBase.Destroy();
		carpetClone.Destroy();
		carpet!.Parent = this.map;

		task.wait(2);
		this.briefcases = this.components.getAllComponents<BriefcaseComponent>();
		this.briefcases.forEach((bc) => {
			bc.claimedEvent.Event.Connect((player: Player) => {
				void this.BriefCaseTouched(player, bc);
			});
		});

		this.barrier = barrier;
	}

	private RandomizeCases() {
		if (this.briefcases.size() < this.badBriefcases) throw "Not enough brief cases";
		const unmarked = [...this.briefcases];
		for (let i = 0; i < this.cases - this.badBriefcases; i++) {
			const index = math.random(0, unmarked.size() - 1);
			const briefCase = unmarked.remove(index);
			if (!briefCase) throw `Index ${index} does not exist for briefCase`;
			briefCase.attributes.safe = true;
		}
	}

	protected async spawnCharacter({ character }: SpawnCharacterArgs) {
		character.HumanoidRootPart.CFrame = new CFrame(-11341.7354, -2128.54565, -3599.82886);
	}

	private EliminatePlayers() {
		this.playersInChallenge.forEach((p) => {
			if (this.playerSelections[p.UserId]) {
				if (!this.playerSelections[p.UserId].attributes.safe) {
					const humanoid = p.Character?.FindFirstChild("Humanoid") as Humanoid | undefined;
					if (humanoid) humanoid.Health = 0;
				}
			} else {
				const humanoid = p.Character?.FindFirstChild("Humanoid") as Humanoid | undefined;
				if (humanoid) humanoid.Health = 0;
			}
		});
	}

	private async BriefCaseTouched(player: Player, briefCase: BriefcaseComponent) {
		if (this.playerSelections[player.UserId]) return;
		if (this.revealing) return;

		this.playerSelections[player.UserId] = briefCase;
		briefCase.attributes.highlightMode = "selected";
		const character = await getCharacter(player);
		character.Humanoid.WalkSpeed = 0;
		character.Humanoid.JumpPower = 0;
	}

	ToggleCases(enabled: boolean) {
		this.briefcases.forEach((bc) => (bc.attributes.highlightMode = enabled ? "reveal" : "disabled"));
		this.revealing = enabled;
	}

	private GetLargestSubarray(arr: unknown[][]): unknown[] | undefined {
		return arr.find(
			(subarray, index) =>
				index ===
				arr.reduce(
					(maxIndex, currentSubarray, currentIndex) =>
						currentSubarray.size() > arr[maxIndex].size() ? currentIndex : maxIndex,
					0,
				),
		);
	}
}
