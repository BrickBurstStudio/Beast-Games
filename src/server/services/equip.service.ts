import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Functions } from "server/network";
import { store } from "server/store";
import { Item, items } from "shared/configs/items";
import { Hat, hats, isHat } from "shared/configs/items/hats";
import { PlayerEquipped } from "shared/store/slices/players/types";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { Case } from "shared/configs/items/cases";

@Service()
export class EquipService implements OnStart {
	onStart() {
		Functions.inventory.equip.setCallback((player, itemId) => {
			const item = items.get(itemId);
			if (!item) return false;

			const state = store.equip(tostring(player.UserId), itemId);
			const itemType = itemId.split("_")[0] as keyof PlayerEquipped;
			const playerEquipped = state.players.equipped[`${player.UserId}`];
			const success = (playerEquipped && !!playerEquipped[itemType].includes(itemId)) ?? false;

			if (success) this.Equip(item);

			return success;
		});

		Functions.inventory.unequip.setCallback((player, itemId) => {
			const item = items.get(itemId);
			if (!item) return false;
			const state = store.unequip(tostring(player.UserId), itemId);
			const itemType = itemId.split("_")[0] as keyof PlayerEquipped;

			const playerEquipped = state.players.equipped[`${player.UserId}`];
			const success = (playerEquipped && !!!playerEquipped[itemType].includes(itemId)) ?? false;

			if (success) this.Unequip(item);

			return success;
		});
	}

	Equip(item: Item) {
		if (isHat(item)) {
		}
	}
	Unequip(item: Item) {
		if (isHat(item)) {
		}
	}
}
