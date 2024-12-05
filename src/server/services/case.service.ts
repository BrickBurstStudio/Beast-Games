import { OnStart, Service } from "@flamework/core";
import { Events, Functions } from "server/network";
import { store } from "server/store";
import { chooseRandomItem } from "server/util/getRandomItem";
import { items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";
import { selectPlayerItems } from "shared/store/selectors/players";
import { UNBOXING_CONFIG } from "shared/configs/unboxing";

const MAX_CONCURRENT_UNBOXINGS = UNBOXING_CONFIG.MAX_CONCURRENT;

@Service()
export class CaseService implements OnStart {
	private activeUnboxings = new Map<Player, number>();

	onStart() {
		Functions.inventory.openCase.setCallback(async (player, caseId) => {
			const currentUnboxings = this.activeUnboxings.get(player) ?? 0;

			if (currentUnboxings >= MAX_CONCURRENT_UNBOXINGS) {
				throw "You can only open 5 cases at once. Please wait for current unboxings to finish.";
			}

			const playerInventory = store.getState(selectPlayerItems(tostring(player.UserId)));
			if (!playerInventory) throw "Player inventory not found";
			if (!playerInventory.includes(caseId)) throw "Player does not have this case";

			const caseObject = cases.find((c) => c.id === caseId);
			if (!caseObject) throw "Case not found";

			// Increment active unboxings
			this.activeUnboxings.set(player, currentUnboxings + 1);

			try {
				store.removeItemFromInventory(tostring(player.UserId), caseId);
				const randomItemIdWonFromCase = chooseRandomItem(caseObject);
				store.addItemToInventory(tostring(player.UserId), randomItemIdWonFromCase);
				const randomItem = items.get(randomItemIdWonFromCase);
				if (!randomItem) throw "Item not found. This is a bug. Please report it to the developers.";

				Events.animateUnboxing.broadcast({
					targetPlayer: player,
					caseObject,
					item: randomItem,
				});

				// Wait for animation to complete before decrementing counter
				task.delay(UNBOXING_CONFIG.ANIMATION_DURATION, () => {
					const updatedCount = (this.activeUnboxings.get(player) ?? 1) - 1;
					if (updatedCount <= 0) {
						this.activeUnboxings.delete(player);
					} else {
						this.activeUnboxings.set(player, updatedCount);
					}
				});

				return randomItem;
			} catch (e) {
				// Decrement counter if there was an error
				const updatedCount = (this.activeUnboxings.get(player) ?? 1) - 1;
				if (updatedCount <= 0) {
					this.activeUnboxings.delete(player);
				} else {
					this.activeUnboxings.set(player, updatedCount);
				}
				throw e;
			}
		});
	}
}
