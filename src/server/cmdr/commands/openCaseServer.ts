import { CommandContext } from "@rbxts/cmdr";
import { Functions } from "server/network";
import { cases } from "shared/configs/items/cases";

export = function (context: CommandContext, caseId: (typeof cases)[number]["id"]) {
	Functions.inventory.openCase
		.predict(context.Executor, caseId)
		.then((randomItemWon) => {
		})
		.catch((e) => {
			error(e);
		});
};
