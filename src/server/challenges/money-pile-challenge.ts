import { ServerStorage } from "@rbxts/services";
import { BaseChallenge } from "./base-challenge";

export class MoneyPileChallenge extends BaseChallenge {
	protected readonly map = ServerStorage.ChallengeMaps.MoneyPileChallenge;
	protected Main() {}
}
