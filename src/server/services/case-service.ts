import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Functions } from "server/network";
import { store } from "server/store";
import { chooseRandomItem } from "server/util/getRandomItem";
import { items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";
import { selectPlayerItems } from "shared/store/selectors/players";

@Service()
export class CaseService implements OnStart {
	onStart() {
		Functions.inventory.openCase.setCallback((player, caseId) => {
			const playerInventory = store.getState(selectPlayerItems(tostring(player.UserId)));
			if (!playerInventory) return "Player inventory not found";
			if (!playerInventory.includes(caseId)) return "Player does not have this case";
			const caseObject = items.get(caseId) as (typeof cases)[number];
			if (!caseObject) return "Case not found";

			store.removeItemFromInventory(tostring(player.UserId), caseId);
			const randomItemWonFromCase = chooseRandomItem(caseObject);
			store.addItemToInventory(tostring(player.UserId), randomItemWonFromCase);
		});

		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(3);
		Functions.inventory.openCase.predict(Players.GetPlayers()[0], "case_1");
	}
}
