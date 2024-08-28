import { Dependency, Service } from "@flamework/core";
import BaseChallenge from "./base-challenge";
import { Components } from "@flamework/components";
import BriefCaseComponent from "server/components/brief-case";

export default class CaseRace extends BaseChallenge {
	components = Dependency<Components>();
	protected Main() {
		const x = this.components.getAllComponents<BriefCaseComponent>();
		print(x);
	}
}
