import { CharacterRigR6 } from "@rbxts/promise-character";
import { Players, ServerStorage } from "@rbxts/services";
import { Gizmo } from "server/classes/Gizmo";
import { Pugil } from "server/classes/gizmos/Pugil";
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";

export class PugilChallenge extends BaseChallenge {
	protected map = ServerStorage.ChallengeMaps.PugilChallenge.Clone();
	protected challengeName = "Pugil" as const;
	protected rules = ["Knockout opponents to win!"];
	protected floor = false;
	protected challengeDuration = 60 * 2;
	private finished = false;

	// for more efficient hit validation
	private playerToTeam: Map<Player, Team> = new Map();

	private teams: Team[] = (this.map.Spawns.GetChildren() as BasePart[]).map(
		(spawn) => ({ spawn, players: [] }) as Team,
	);

	protected async main(): Promise<void> {
		this.contestantDiedOrLeft.Event.Connect((player: Player) => {
			const team = this.teams.find((team) => team.players.includes(player));
			if (!team) return;
			team.players = team.players.filter((p) => p !== player);

			let teamsLeft = this.teams.filter((team) => team.players.size() > 0);
			if (teamsLeft.size() <= 1) {
				this.finished = true;
			}
		});
		this.toggleFloor(false);

		while (!this.finished) task.wait();
	}

	protected spawnCharacter({ player, character, i }: SpawnCharacterArgs): void {
		const team = this.teams[i % this.teams.size()];
		team.players.push(player);
		character.PivotTo(team.spawn.CFrame);

		const circleBGUI = ServerStorage.Assets.Gui.CircleBGUI.Clone();
		circleBGUI.Frame.BackgroundColor3 = team.spawn.Color;
		circleBGUI.Parent = character.FindFirstChild("Head");
		this.obliterator.Add(circleBGUI);

		this.playerToTeam.set(player, team);

		const pugil = Gizmo.give(player, Pugil);
		pugil.setHitValidator((character) => {
			const hitPlayer = Players.GetPlayerFromCharacter(character);
			if (!hitPlayer) return false;
			return this.playerToTeam.get(hitPlayer) !== team;
		});
	}

	protected async onTimerExpired(): Promise<void> {
		// kill all players on the team with the least amount of players (if there is a tie, kill both teams)
		const teamsWithLeastPlayers = this.teams.filter(
			(team) => team.players.size() === math.min(...this.teams.map((t) => t.players.size())),
		);
		await Promise.all(
			teamsWithLeastPlayers.map(async (team) =>
				team.players.map(async (player) => {
					if (player.Character === undefined) return;

					(player.Character as CharacterRigR6).Humanoid.Health = 0;
				}),
			),
		);
	}
}

type Team = {
	players: Player[];
	spawn: BasePart;
};
