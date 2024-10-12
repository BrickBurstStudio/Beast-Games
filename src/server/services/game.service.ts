import { OnStart, Service } from "@flamework/core";
import Object from "@rbxts/object-utils";
import RegExp from "@rbxts/regexp";
import { Players, Workspace } from "@rbxts/services";
import { create } from "@rbxts/vide";
import { BriefcaseChallenge } from "server/challenges/briefcase.challenge";
import { MoneyPileChallenge } from "server/challenges/money-pile.challenge";
import { RICH_TEXT_REPLACE } from "shared/configs/announcer";
import createForcefield from "shared/utils/functions/createForcefield";

@Service()
export class GameService implements OnStart {
	async onStart() {
		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(0.5);
		await new MoneyPileChallenge().Start();
	}
}
