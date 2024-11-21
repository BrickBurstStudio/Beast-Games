import { Gizmo } from "server/classes/Gizmo";
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";
import { Players, ServerStorage } from "@rbxts/services";
import { Pugil } from "server/classes/gizmos/Pugil";
import { CharacterRigR6 } from "@rbxts/promise-character";

export class PugilChallenge extends BaseChallenge {
	protected map = ServerStorage.ChallengeMaps.PugilChallenge.Clone();
	protected challengeName = "Knockoff Knockout";
	protected rules = ["Knockout opponents to win!"];
	protected floor = false;
	private finished = false;

	private teams: Team[] = (this.map.Spawns.GetChildren() as BasePart[]).map(
		(spawn) => ({ spawn, players: [] }) as Team,
	);

	protected async Main(): Promise<void> {
		this.contestantDiedOrLeft.Event.Connect((player: Player) => {
			const team = this.teams.find((team) => team.players.includes(player));
			if (!team) return;
			team.players = team.players.filter((p) => p !== player);

			let teamsLeft = this.teams.filter((team) => team.players.size() > 0);
			if (teamsLeft.size() <= 1) {
				this.finished = true;
			}
		});
		this.ToggleFloor(false);

		while (!this.finished) task.wait();
	}
	protected SpawnCharacter({ player, character, i }: SpawnCharacterArgs): void {
		const team = this.teams[i % this.teams.size()];
		team.players.push(player);
		character.PivotTo(team.spawn.CFrame);

		const circleBGUI = ServerStorage.Assets.Gui.CircleBGUI.Clone();
		circleBGUI.Frame.BackgroundColor3 = team.spawn.Color;
		circleBGUI.Parent = character.FindFirstChild("Head");
		this.obliterator.Add(circleBGUI);

		Gizmo.give(player, Pugil);
	}
}

type Team = {
	players: Player[];
	spawn: BasePart;
};
