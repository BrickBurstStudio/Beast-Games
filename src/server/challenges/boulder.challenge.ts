import Make from "@rbxts/make";
import { RunService, ServerStorage } from "@rbxts/services";
import { Events } from "server/network";
import { store } from "server/store";
import { announce } from "server/util/announce";
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
	protected challengeDuration = RunService.IsStudio() ? 5 : 60;
	protected readonly challengeName = "Boulder Pull" as const;
	protected readonly rules = [
		"You will be assigned a random team.",
		"You must work with your team to pull the boulder to the finish line.",
		"The last team to cross the finish line will be eliminated!",
	];
	protected readonly map = ServerStorage.ChallengeMaps.BoulderChallenge.Clone();

	// TODO: we have to test what a good finish goal for each player is
	private readonly finishGoalPerPlayer = 5;
	private teamProgress: number[] = [0, 0, 0, 0, 0];
	private teamFinishGoals: number[] = [0, 0, 0, 0, 0];
	private teamsCompleted = 0;
	private activeTeams = new Set<number>();

	protected async main() {
		await Promise.all(
			this.playersInChallenge.map(async (player) => {
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
			Events.challenges.boulderChallenge.pull.connect(async (player) => {
				const team = player.GetAttribute("team") as number;
				if (this.teamProgress[team] >= this.teamFinishGoals[team]) return;

				this.teamProgress[team] += 0.1;

				if (this.teamProgress[team] < this.teamFinishGoals[team]) return;
				this.teamsCompleted++;

				if (this.teamsCompleted >= this.teamFinishGoals.size()) return;

				Events.announcer.announce(
					this.playersInChallenge.filter((p) => (p.GetAttribute("team") as number) === team),
					[`Congratulations! Your team finished in place number ${this.teamsCompleted}!`],
				);
			}),
			"Disconnect",
		);

		while (this.teamsCompleted < this.teamFinishGoals.size() - 1) {
			// Update the boulder position for each team
			this.UpdateAssetPositions();

			// Count active teams (teams still pulling)
			let activeTeams = 0;
			for (let i = 0; i < 5; i++) {
				if (this.teamProgress[i] < this.teamFinishGoals[i]) {
					activeTeams++;
				}
			}

			// If only one team is left, end the game and eliminate that team
			if (activeTeams === 1) {
				const lastTeam = this.teamProgress.findIndex(
					(progress, i) => this.activeTeams.has(i) && progress < this.teamFinishGoals[i],
				);

				store.setChallenge(undefined);
				await announce([`Team ${lastTeam + 1} was the last team pulling and has been eliminated!`], {
					[lastTeam]: `<font color="#${TeamColors[lastTeam as keyof typeof TeamColors].ToHex()}">Team ${lastTeam + 1}</font>`,
				});

				await this.killTeamPlayers(lastTeam);

				this.playersInChallenge = this.playersInChallenge.filter(
					(player) => player.GetAttribute("team") !== lastTeam,
				);

				break;
			}

			// Slowly decrease the progress for each team
			for (let i = 0; i < 5; i++) {
				if (this.teamProgress[i] > 0 && this.teamProgress[i] < this.teamFinishGoals[i]) {
					this.teamProgress[i] = math.max(0, this.teamProgress[i] - 0.005);
				}
			}

			task.wait();
		}

		this.UpdateAssetPositions();

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
				const progress = this.teamProgress[team] / this.teamFinishGoals[team];
				boulder.Position = startPos.Lerp(endPos, progress);
			}
			{
				const rope = teamAssets.Rope as Part;
				const startPos = teamAssets.Rope.GetAttribute("initialPosition") as Vector3;
				const endPos = startPos.add(new Vector3(0, 0, -15));
				const progress = (this.teamProgress[team] / this.teamFinishGoals[team]) * 0.5;
				rope.Position = startPos.Lerp(endPos, progress);
			}
		}
	}

	protected spawnCharacter({ player, character, i }: SpawnCharacterArgs): void {
		character.Humanoid.WalkSpeed = 0;
		character.Humanoid.JumpHeight = 0;

		const team = i % 5;
		this.activeTeams.add(team);
		const teamAssets = this.map[tostring(team) as keyof typeof this.map] as (typeof this.map)["1"];

		character.HumanoidRootPart.CFrame = teamAssets.Rope.CFrame.mul(
			new CFrame(-teamAssets.Rope.Size.X / 2 + (i + team) * 5, 1, (i - team) % 2 === 0 ? -2.5 : 2.5),
		).mul(CFrame.Angles(0, math.pi / -2, 0));
		
		Make("WeldConstraint", {
			Parent: character.HumanoidRootPart,
			Part0: character.HumanoidRootPart,
			Part1: teamAssets.Rope,
		});

		player.SetAttribute("team", team);
	}

	protected async CleanUp() {
		return Promise.all(
			this.playersInChallenge.map(async (player) => {
				const character = await getCharacter(player);

				character.Humanoid.WalkSpeed = 16;
				character.Humanoid.JumpHeight = 50;
			}),
		);
	}

	private async killTeamPlayers(teamNumber: number) {
		await Promise.all(
			this.playersInChallenge
				.filter((player) => player.GetAttribute("team") === teamNumber)
				.map(async (player) => {
					if (player.Character) {
						const character = await getCharacter(player);
						character.Humanoid.Health = 0;
					}
				}),
		);
	}

	protected async onTimerExpired() {
		const unfinishedTeams = new Set<number>();

		// Find all unfinished teams
		for (let i = 0; i < 5; i++) {
			if (this.teamProgress[i] < this.teamFinishGoals[i] && this.activeTeams.has(i)) {
				unfinishedTeams.add(i);
			}
		}
		print(unfinishedTeams);
		// Eliminate all unfinished teams

		announce(["Time has run out! All unfinished teams have been eliminated!"]);

		unfinishedTeams.forEach(async (teamNumber) => {
			await this.killTeamPlayers(teamNumber);
			this.playersInChallenge = this.playersInChallenge.filter(
				(player) => player.GetAttribute("team") !== teamNumber,
			);
		});
	}
}
