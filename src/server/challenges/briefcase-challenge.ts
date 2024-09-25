// import { Dependency } from "@flamework/core";
// import { Components } from "@flamework/components";
// import { getCharacter } from "shared/utils/functions/getCharacter";
// import { KeyframeSequenceProvider, Players, ReplicatedStorage, ServerStorage, Workspace } from "@rbxts/services";
// import { BaseChallenge } from "./base-challenge";
// import { BriefcaseComponent } from "server/components/claim-components/briefcase-component";
// import Object from "@rbxts/object-utils";
// import { generatePlayerGrid } from "server/util/generatePlayerGrid";
// import Make from "@rbxts/make";
// import { Events } from "server/network";

// export class BriefcaseChallenge extends BaseChallenge {
// 	protected announcements = ["fetus"];
// 	protected readonly map = ServerStorage.ChallengeMaps.BriefcaseChallenge.Clone();
// 	readonly components = Dependency<Components>();
// 	readonly badBriefcases = 50;
// 	readonly revealTime = 5;
// 	readonly cellPadding = 10;

// 	readonly playerSelections: { [key: Player["UserId"]]: BriefcaseComponent } = {};
// 	briefcases: BriefcaseComponent[] = [];
// 	revealing = false;

// 	protected async Main() {
// 		const cases = 150 + this.badBriefcases;
// 		const grid = generatePlayerGrid(cases, 10);
// 		const largestY = this.GetLargestSubarray(grid)!;
// 		const gridCenterXOffset = grid.size() * (this.cellPadding / 2) - this.cellPadding / 2;
// 		const gridCenterYOffset = largestY.size() * (this.cellPadding / 2) - this.cellPadding / 2;

// 		for (let x = 0; x < grid.size(); x++) {
// 			for (let y = 0; y < largestY.size(); y++) {
// 				const briefcaseStand = ReplicatedStorage.Assets.Objects.BriefcaseStand.Clone();
// 				briefcaseStand.Parent = this.map;
// 				briefcaseStand.PivotTo(
// 					this.map.Baseplate.CFrame.mul(
// 						new CFrame(
// 							x * this.cellPadding - gridCenterXOffset,
// 							this.map.Baseplate.Size.Y / 2 + briefcaseStand.PrimaryPart!.Size.X / 2,
// 							y * this.cellPadding - gridCenterYOffset,
// 						),
// 					).mul(CFrame.Angles(0, 0, math.rad(-90))),
// 				);

// 				const clone = ReplicatedStorage.Assets.Objects.Briefcase.Clone();
// 				clone.Part.Anchored = true;
// 				clone.Parent = this.map.Briefcases;
// 				clone.Part.CFrame = new CFrame(briefcaseStand.GetPivot().Position)
// 					.mul(new CFrame(0, briefcaseStand.PrimaryPart!.Size.X / 2 + 0.5, 0))
// 					.mul(CFrame.Angles(math.rad(90), 0, 0));
// 			}
// 		}

// 		const carpetBase = Make("Part", {
// 			Parent: this.map,
// 			Anchored: true,
// 			Size: new Vector3(
// 				grid.size() * this.cellPadding + this.cellPadding / 2,
// 				0,
// 				largestY.size() * this.cellPadding + this.cellPadding / 2,
// 			),
// 			BrickColor: new BrickColor("Really red"),
// 			CFrame: this.map.Baseplate.CFrame.mul(new CFrame(0, this.map.Baseplate.Size.Y / 2 + 0.1, 0)),
// 		});

// 		const barrier = carpetBase.Clone();
// 		barrier.Size = barrier.Size.add(new Vector3(0, 500, 0));
// 		barrier.Transparency = 1;
// 		barrier.Parent = this.map;

// 		const carpetClone = carpetBase.Clone();
// 		carpetClone.Size = carpetClone.Size.sub(new Vector3(4, -5, 4));
// 		carpetClone.Parent = this.map;

// 		const carpet = carpetBase.SubtractAsync([carpetClone]);
// 		carpetBase.Destroy();
// 		carpetClone.Destroy();
// 		carpet!.Parent = this.map;

// 		task.wait(2);
// 		this.briefcases = this.components.getAllComponents<BriefcaseComponent>();
// 		this.briefcases.forEach((bc) => {
// 			bc.claimedEvent.Event.Connect((player: Player) => {
// 				void this.BriefCaseTouched(player, bc);
// 			});
// 		});

// 		Events.announcer.announce.broadcast([
// 			`Only ${cases - this.badBriefcases} cases here are safe. ${this.badBriefcases} cases are deadly.`,
// 			"Once a case is touched, that player owns that case. It cannot be stolen back.",
// 			"If you end up with a red case, you are eliminated.",
// 			"Memorize the safe cases! You have 30 seconds until you must run for a case.",
// 		]);
// 		this.RandomizeCases();
// 		task.wait(20);
// 		Events.announcer.announce.broadcast([
// 			"(dev: 15 second countdown is supposed to start now, but no implementation",
// 		]);
// 		this.ToggleCases(true);
// 		task.wait(15);
// 		this.ToggleCases(false);
// 		barrier.Destroy();
// 		// todo: wait until time, or until all cases are claimed
// 		task.wait(10);

// 		Events.announcer.announce.broadcast([
// 			"All players have claimed a case. Let's reveal who won, and who will die...",
// 		]);
// 		task.wait(8);
// 		this.ToggleCases(true);
// 		task.wait(10);
// 		this.EliminatePlayers();

// 		task.wait(50000);
// 	}

// 	private RandomizeCases() {
// 		if (this.briefcases.size() < this.badBriefcases) throw "Not enough brief cases";
// 		const unmarked = [...this.briefcases];
// 		for (let i = 0; i < this.badBriefcases; i++) {
// 			const index = math.random(0, unmarked.size() - 1);
// 			const briefCase = unmarked.remove(index);
// 			if (!briefCase) throw `Index ${index} does not exist for briefCase`;
// 			briefCase.attributes.safe = false;
// 		}
// 	}

// 	protected async SpawnCharacter(players: Player[]) {
// 		players.forEach(async (player) => {
// 			const character = await getCharacter(player);
// 			character.HumanoidRootPart.CFrame = this.map.Baseplate.CFrame.add(
// 				new Vector3(-10, this.map.Baseplate.Size.Y / 2 + 5, 0),
// 			);
// 		});
// 	}

// 	private EliminatePlayers() {
// 		for (const [userId, briefcase] of Object.entries(this.playerSelections)) {
// 			const player = Players.GetPlayerByUserId(userId);
// 			if (!briefcase.attributes.safe && player) this.EliminatePlayer(player);
// 		}
// 	}

// 	private async BriefCaseTouched(player: Player, briefCase: BriefcaseComponent) {
// 		if (this.playerSelections[player.UserId]) return;
// 		if (this.revealing) return;

// 		this.playerSelections[player.UserId] = briefCase;
// 		briefCase.attributes.highlightMode = "selected";
// 		const character = await getCharacter(player);
// 		character.Humanoid.WalkSpeed = 0;
// 		character.Humanoid.JumpPower = 0;
// 	}

// 	ToggleCases(enabled: boolean) {
// 		this.briefcases.forEach((bc) => (bc.attributes.highlightMode = enabled ? "reveal" : "disabled"));
// 		this.revealing = enabled;
// 	}

// 	private GetLargestSubarray(arr: unknown[][]): unknown[] | undefined {
// 		return arr.find(
// 			(subarray, index) =>
// 				index ===
// 				arr.reduce(
// 					(maxIndex, currentSubarray, currentIndex) =>
// 						currentSubarray.size() > arr[maxIndex].size() ? currentIndex : maxIndex,
// 					0,
// 				),
// 		);
// 	}
// }
