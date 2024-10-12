import { ServerStorage } from "@rbxts/services";
import { Events } from "server/network";
import { store } from "server/store";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";
import Make from "@rbxts/make";

const TeamColors = {
	0: Color3.fromRGB(255, 0, 0),
	1: Color3.fromRGB(255, 255, 0),
	2: Color3.fromRGB(255, 128, 0),
	3: Color3.fromRGB(0, 191, 0),
	4: Color3.fromRGB(255, 15, 232),
};

export class BoulderChallenge extends BaseChallenge {
	protected readonly map = ServerStorage.ChallengeMaps.BoulderChallenge.Clone();

	// todo: make calculation based on player count
	private readonly finishGoal = 5;

	private teamProgress: number[] = [0, 0, 0, 0, 0];

	protected async Main() {
		const connection = Events.challenges.boulderChallenge.pull.connect(async (player) => {
			this.teamProgress[player.GetAttribute("team") as number]++;
			if (this.teamProgress[player.GetAttribute("team") as number] >= this.finishGoal) {
				connection.Disconnect();

				const losingTeam = this.teamProgress.indexOf(math.min(...this.teamProgress));
				await Promise.all(
					this.players
						.filter((player) => player.GetAttribute("team") === losingTeam)
						.map((player) => this.EliminatePlayer(player)),
				);
			}
		});

		store.setChallenge("Boulder");

		task.wait(5000);
		this.CleanUp();
	}

	protected SpawnCharacter({ player, character, i }: SpawnCharacterArgs): void {
		character.Humanoid.WalkSpeed = 0;
		character.Humanoid.JumpHeight = 0;

		const team = i % 5;
		const teamAssets = this.map[tostring(team) as keyof typeof this.map] as (typeof this.map)["1"];
		character.HumanoidRootPart.CFrame = teamAssets.Rope.CFrame.mul(
			new CFrame(teamAssets.Rope.Size.X / 2 - (i - team) * 1.5, 0, (i - team) % 2 === 0 ? -2.5 : 2.5),
		).mul(CFrame.Angles(0, math.pi / -2, 0));
		i += 1;

		const weld = Make("WeldConstraint", {
			Parent: character.HumanoidRootPart,
			Part0: character.HumanoidRootPart,
			Part1: teamAssets.Rope,
		});

		player.SetAttribute("team", team);
		character.GetChildren().forEach((child) => {
			if (child.IsA("BasePart")) {
				child.Color = TeamColors[team as keyof typeof TeamColors];
			}
		});
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
