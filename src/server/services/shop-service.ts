import { OnStart, Service } from "@flamework/core";
import { Functions } from "server/network";
import { store } from "server/store";
import { items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";
import { selectPlayerBalance } from "shared/store/selectors/players";

@Service()
export class ShopService implements OnStart {
	onStart() {
		Functions.purchase.case.setCallback((player, caseId) => {
			const caseObj = items.get(caseId) as (typeof cases)[number];
			if (!caseObj) return `Case not found. This is a bug. Please report it to the developers.`;

			const playerCash = store.getState(selectPlayerBalance(tostring(player.UserId), "cash"));

			if (!playerCash) return "Player not found. Try again in a few seconds.";

			if (playerCash < caseObj.price) return "You do not have enough cash to purchase this case.";

			store.changeBalance(tostring(player.UserId), "cash", -caseObj.price);
			// Adding case to inventory should be the last operation to prevent duplication with players leaving
			store.addItemToInventory(tostring(player.UserId), caseId);
		});

		//TODO: Implement purchaseAction
		Functions.purchase.action.setCallback((player) => {
			return "Not implemented";
		});
	}
}
