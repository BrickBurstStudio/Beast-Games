import { OnStart, Service } from "@flamework/core";
import { Functions } from "server/network";
import { store } from "server/store";
import { cases } from "shared/configs/items/cases";
import { selectPlayerData } from "shared/store/selectors/players";

@Service()
export class ShopService implements OnStart {
	onStart() {
		Functions.purchaseCase.setCallback((player, caseId) => {
			const caseObj = cases[(tonumber(caseId.split("_")[1]) as number) - 1];
			if (!caseObj) return `Case with id ${caseId} not found`;

			const playerData = store.getState(selectPlayerData(tostring(player.UserId)));

			if (playerData.balance.cash < caseObj.price) return "You do not have enough cash to purchase this case";

			store.changeBalance(tostring(player.UserId), "cash", -caseObj.price);
			// Adding case to inventory should be the last operation to prevent duplication with players leaving
			store.addItemToInventory(tostring(player.UserId), caseId);
		});

		//TODO: Implement purchaseAction
		Functions.purchaseAction.setCallback((player) => {
			return "Not implemented";
		});
	}
}
