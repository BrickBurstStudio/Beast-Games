import { Dependency } from "@flamework/core";
import BaseChallenge from "./base-challenge";
import { Components } from "@flamework/components";
import BriefCaseComponent from "server/components/briefcase-component";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

export default class CaseRace extends BaseChallenge {
	readonly components = Dependency<Components>();
	readonly badBriefCases = 4;
	readonly revealTime = 5;

	readonly playerSelections: { [key: Player["Name"]]: BriefCaseComponent } = {};
	briefCases: Array<BriefCaseComponent> = [];
	revealing = false;

	protected Main() {
		for (let i = 0; i < 10; i++) {
			const clone = ReplicatedStorage.Assets.Objects.Briefcase.Clone();
			clone.Anchored = true;
			clone.Parent = Workspace;
			clone.CFrame = clone.CFrame.mul(new CFrame(new Vector3(i * 5, 0, 0)));
		}
		task.wait(2);

		this.briefCases = this.components.getAllComponents<BriefCaseComponent>();
		this.briefCases.forEach((bc) => {
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
	}

	private async BriefCaseTouched(player: Player, briefCase: BriefCaseComponent) {
		if (this.playerSelections[player.Name]) return;
		if (this.revealing) return;

		this.playerSelections[player.Name] = briefCase;
		briefCase.attributes.highlightMode = "selected";
		const character = await getCharacter(player);
		character.Humanoid.WalkSpeed = 0;
		character.Humanoid.JumpPower = 0;
	}

	private RandomizeCases() {
		if (this.briefCases.size() < this.badBriefCases) throw "Not enough brief cases";

		const unmarked = [...this.briefCases];
		for (let i = 0; i < this.badBriefCases; i++) {
			const index = math.random(0, unmarked.size() - 1);
			const briefCase = unmarked.remove(index);
			if (!briefCase) throw `Index ${index} does not exist for briefCase`;
			briefCase.attributes.safe = false;
		}
	}

	private ToggleCases(enabled: boolean) {
		this.briefCases.forEach((bc) => (bc.attributes.highlightMode = enabled ? "reveal" : "disabled"));
		this.revealing = enabled;
	}
}
