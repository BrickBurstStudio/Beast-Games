import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { BaseChallenge } from "./base-challenge";
import { BriefcaseComponent } from "server/components/claim-components/briefcase-component";

export class BriefcaseChallenge extends BaseChallenge {
	readonly components = Dependency<Components>();
	readonly badBriefcases = 4;
	readonly revealTime = 5;

	readonly playerSelections: { [key: Player["UserId"]]: BriefcaseComponent } = {};
	briefcases: Array<BriefcaseComponent> = [];
	revealing = false;

	protected Main() {
		for (let i = 0; i < 10; i++) {
			const clone = ReplicatedStorage.Assets.Objects.Briefcase.Clone();
			clone.Part.Anchored = true;
			clone.Parent = Workspace;
			clone.Part.CFrame = clone.Part.CFrame.mul(new CFrame(new Vector3(i * 5, 0, 0)));
		}
		task.wait(2);

		this.briefcases = this.components.getAllComponents<BriefcaseComponent>();
		this.briefcases.forEach((bc) => {
			bc.claimedEvent.Event.Connect((player: Player) => {
				void this.BriefCaseTouched(player, bc);
			});
		});

		this.RandomizeCases();
		this.ToggleCases(true);
		task.wait(5);
		this.ToggleCases(false);
		task.wait(5);
		this.ToggleCases(true);
		task.wait(2);
		this.EliminatePlayers();
	}

	private EliminatePlayers() {
		for (const [userId, briefcase] of pairs(this.playerSelections)) {
			const player = Players.GetPlayerByUserId(userId);
			if (!briefcase.attributes.safe && player) this.EliminatePlayer(player);
		}
	}

	private async BriefCaseTouched(player: Player, briefCase: BriefcaseComponent) {
		if (this.playerSelections[player.UserId]) return;
		if (this.revealing) return;

		this.playerSelections[player.UserId] = briefCase;
		briefCase.attributes.highlightMode = "selected";
		const character = await getCharacter(player);
		// character.Humanoid.WalkSpeed = 0;
		// character.Humanoid.JumpPower = 0;
	}

	private RandomizeCases() {
		if (this.briefcases.size() < this.badBriefcases) throw "Not enough brief cases";

		const unmarked = [...this.briefcases];
		for (let i = 0; i < this.badBriefcases; i++) {
			const index = math.random(0, unmarked.size() - 1);
			const briefCase = unmarked.remove(index);
			if (!briefCase) throw `Index ${index} does not exist for briefCase`;
			briefCase.attributes.safe = false;
		}
	}

	private ToggleCases(enabled: boolean) {
		this.briefcases.forEach((bc) => (bc.attributes.highlightMode = enabled ? "reveal" : "disabled"));
		this.revealing = enabled;
	}
}
