import { CommandContext } from "@rbxts/cmdr";
import { Functions } from "server/network";
import { cases } from "shared/configs/items/cases";

export = function (context: CommandContext, caseId: (typeof cases)[number]["id"]) {
	Functions.purchase.case
		.predict(context.Executor, caseId)
		.then(() => {
			print(`Purchased ${caseId} case.`);
		})
		.catch((e) => {
			return error(e);
		});
};
