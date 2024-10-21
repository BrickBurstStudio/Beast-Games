import Make from "@rbxts/make";
import { ServerStorage } from "@rbxts/services";
import { Events } from "server/network";
import { store } from "server/store";
import { announce } from "server/util/announce";
import { countdown } from "server/util/countdown";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";

const TeamColors = {
	0: Color3.fromRGB(255, 0, 0),
	1: Color3.fromRGB(255, 255, 0),
	2: Color3.fromRGB(255, 128, 0),
	3: Color3.fromRGB(0, 191, 0),
	4: Color3.fromRGB(255, 15, 232),
};

export class BoulderChallenge extends BaseChallenge {
	protected readonly map = ServerStorage.ChallengeMaps.BoulderChallenge.Clone();

	// TODO: we have to test what a good finish goal for each player is
	private readonly finishGoalPerPlayer = 3;
	private readonly maxCPS = 10;
	private readonly baseClimbRate = 0.0001;
	private teamProgress: number[] = [0, 0, 0, 0, 0];
	private teamCPS: number[] = [0, 0, 0, 0, 0];
	private teamClicks: number[] = [0, 0, 0, 0, 0];
	private teamsFinished: boolean[] = [false, false, false, false, false];
	private lastSecondTime: undefined | number = undefined;
	private teamFinishGoals: number[] = [0, 0, 0, 0, 0];

	private teamsCompleted = 0;

	protected async Main() {
		await Promise.all(
			this.players.map(async (player) => {
				this.teamFinishGoals[player.GetAttribute("team") as number] =
					this.teamFinishGoals[player.GetAttribute("team") as number] + this.finishGoalPerPlayer;
			}),
		);

		await Promise.all(
			this.teamProgress.map((_, team) => {
				const teamAssets = this.map[tostring(team) as keyof typeof this.map] as (typeof this.map)["1"];
				teamAssets.Rope.SetAttribute("initialPosition", teamAssets.Rope.Position);
			}),
		);

		this.obliterator.Add(
			// TODO: Add debounce to combat autoclicking basically they would have a max of like 10 cps or something like that
			Events.challenges.boulderChallenge.pull.connect(async (player) => {
				const team = player.GetAttribute("team") as number;
				this.teamClicks[team]++;

				if (this.lastSecondTime !== undefined && DateTime.now().UnixTimestamp - this.lastSecondTime >= 1) {
					const cps = this.teamClicks[team] / (DateTime.now().UnixTimestamp - this.lastSecondTime);
					this.teamClicks[team] = 0;
					this.teamCPS[team] = math.clamp(cps, 0, this.maxCPS);
					this.lastSecondTime = DateTime.now().UnixTimestamp;
				}

				// If the team has reached their goal, do nothing
				// if (this.teamProgress[team] >= this.teamFinishGoals[team]) return;

				// Team still playing so increment their progress
				// this.teamProgress[team] += 0.1;

				// Check if the team has finally reached their goal
				// if (this.teamProgress[team] < this.teamFinishGoals[team]) return;
				// this.teamsCompleted++;

				// Check if all teams have finished
				// if (this.teamsCompleted >= this.teamFinishGoals.size()) return;

				// Events.announcer.announce(
				// 	this.players.filter((p) => (p.GetAttribute("team") as number) === team),
				// 	[`Congratulations! Your team finished in place number ${this.teamsCompleted}!`],
				// );
			}),
			"Disconnect",
		);

		// await announce([`The last team to finish pulling the boulder will be eliminated!`]);
		// await countdown({ seconds: 5, description: "Get ready..." });
		store.setChallenge("Boulder");

		this.lastSecondTime = DateTime.now().UnixTimestamp;
		while (this.teamsCompleted < this.teamFinishGoals.size() - 1) {
			// Update the boulder position for each team
			this.UpdateAssetPositions();

			// Slowly decrease the progress for each team
			for (let i = 0; i < 5; i++) {
				if (this.teamProgress[i] > 0 && this.teamProgress[i] < this.teamFinishGoals[i]) {
					this.teamProgress[i] = math.max(0, this.teamProgress[i] - 0.005);
				}
			}

			task.wait();
		}

		this.UpdateAssetPositions();

		store.setChallenge(undefined);
		const losingTeam = this.teamProgress.indexOf(math.min(...this.teamProgress));

		await announce([`The team to finish pulling their boulder last is: ${losingTeam}`], {
			[losingTeam]: `<font color="#${TeamColors[losingTeam as keyof typeof TeamColors].ToHex()}">Team ${losingTeam + 1}</font>`,
		});

		Promise.all(
			this.players
				.filter((player) => player.GetAttribute("team") === losingTeam)
				.map((player) => this.EliminatePlayer(player)),
		);

		this.CleanUp();
	}

	protected UpdateAssetPositions() {
		for (let team = 0; team < 5; team++) {
			// This is for redudency incase it goes over the goal
			if (this.teamProgress[team] > this.teamFinishGoals[team])
				this.teamProgress[team] = this.teamFinishGoals[team];

			const teamAssets = this.map[tostring(team) as keyof typeof this.map] as (typeof this.map)["1"];
			{
				const boulder = teamAssets.Boulder as Part;
				const startPos = new Vector3(
					teamAssets.Boulder.Position.X,
					teamAssets.Rope.Position.Y - teamAssets.Rope.Size.Y / 2 + teamAssets.Boulder.Size.Y / 2,
					teamAssets.Boulder.Position.Z,
				);
				const endPos = startPos.add(new Vector3(0, 50, 0));
				const lerpValue = this.baseClimbRate + this.teamCPS[team] * this.baseClimbRate * 2;
				boulder.Position = boulder.Position.Lerp(endPos, lerpValue);
				if (boulder.Position.sub(endPos).Magnitude < 3 && !this.teamsFinished[team]) {
					Events.announcer.announce(
						this.players.filter((p) => (p.GetAttribute("team") as number) === team),
						[`Congratulations! Your team finished in place number ${++this.teamsCompleted}!`],
					);
					this.teamsFinished[team] = true;
				}
			}
			{
				const rope = teamAssets.Rope as Part;
				const startPos = teamAssets.Rope.GetAttribute("initialPosition") as Vector3;
				const endPos = startPos.add(new Vector3(0, 0, -25));
				rope.Position = startPos.Lerp(endPos, 0.1);
			}
		}
	}

	protected SpawnCharacter({ player, character, i }: SpawnCharacterArgs): void {
		character.Humanoid.WalkSpeed = 0;
		character.Humanoid.JumpHeight = 0;

		const team = i % 5;
		const teamAssets = this.map[tostring(team) as keyof typeof this.map] as (typeof this.map)["1"];

		character.HumanoidRootPart.CFrame = teamAssets.Rope.CFrame.mul(
			new CFrame(teamAssets.Rope.Size.X / 2 - (i - team) * 1.5, 0, (i - team) % 2 === 0 ? -2.5 : 2.5),
		).mul(CFrame.Angles(0, math.pi / -2, 0));

		const weld = Make("WeldConstraint", {
			Parent: character.HumanoidRootPart,
			Part0: character.HumanoidRootPart,
			Part1: teamAssets.Rope,
		});

		player.SetAttribute("team", team);
	}

	protected async CleanUp() {
		return Promise.all(
			this.players.map(async (player) => {
				const character = await getCharacter(player);

				character.Humanoid.WalkSpeed = 16;
				character.Humanoid.JumpHeight = 50;
			}),
		);
	}
}
