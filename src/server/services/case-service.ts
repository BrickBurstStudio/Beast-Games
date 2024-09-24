import { OnStart, Service } from "@flamework/core";
import { Events, Functions } from "server/network";
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
			if (!playerInventory) throw error("Player inventory not found");
			if (!playerInventory.includes(caseId)) throw error("Player does not have this case");
			const caseObject = items.get(caseId) as (typeof cases)[number];
			if (!caseObject) throw error("Case not found");

			store.removeItemFromInventory(tostring(player.UserId), caseId);
			const randomItemIdWonFromCase = chooseRandomItem(caseObject);
			store.addItemToInventory(tostring(player.UserId), randomItemIdWonFromCase);
			const randomItem = items.get(randomItemIdWonFromCase);
			if (!randomItem) throw error("Item not found. This is a bug. Please report it to the developers.");
			// Events.animateUnboxing.broadcast(player, randomItem);
			return randomItem;
		});
	}
}
