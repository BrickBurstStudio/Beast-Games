import { ServerStorage } from "@rbxts/services";
import { BaseChallenge } from "./base-challenge";

export class FlagChallenge extends BaseChallenge {
	protected readonly map = ServerStorage.ChallengeMaps.FlagChallenge;
	protected Main() {}
}
