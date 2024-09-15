import { OnStart, Service } from "@flamework/core";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Functions } from "server/network";
import { store } from "server/store";
import { items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";

@Service()
export class ShopService implements OnStart {
	onStart() {
		Functions.purchase.case.setCallback((player, caseId) => {
			const caseObj = items.get(caseId) as (typeof cases)[number];
			if (!caseObj) throw error(`Case not found. This is a bug. Please report it to the developers.`);

			const orderedPlayerData = new OrderedPlayerData(player);
			const playerCash = orderedPlayerData.cash.Get();

			if (!playerCash) throw error("Player not found. Try again in a few seconds.");

			if (playerCash < caseObj.price) throw error("You do not have enough cash to purchase this case.");

			orderedPlayerData.cash.UpdateBy(-caseObj.price);
			// Adding case to inventory should be the last operation to prevent duplication with players leaving
			store.addItemToInventory(tostring(player.UserId), caseId);
		});

		//TODO: Implement purchaseAction
		Functions.purchase.action.setCallback((player) => {});
	}
}
