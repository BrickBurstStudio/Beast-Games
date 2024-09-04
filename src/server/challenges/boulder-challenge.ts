import { ServerStorage } from "@rbxts/services";
import { BaseChallenge } from "./base-challenge";

export class BoulderChallenge extends BaseChallenge {
	protected readonly map = ServerStorage.ChallengeMaps.BoulderChallenge.Clone();
	protected Main() {}
}
