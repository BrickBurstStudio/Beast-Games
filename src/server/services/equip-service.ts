import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Functions } from "server/network";
import { store } from "server/store";
import { PlayerEquipped } from "shared/store/slices/players/types";

@Service()
export class EquipService implements OnStart {
	onStart() {
		Functions.inventory.equip.setCallback((player, itemId) => {
			const state = store.equip(tostring(player.UserId), itemId);
			const itemType = itemId.split("_")[0] as keyof PlayerEquipped;

			const playerEquipped = state.players.equipped[`${player.UserId}`];
			const success = (playerEquipped && !!playerEquipped[itemType].includes(itemId)) ?? false;

			print(success, playerEquipped && playerEquipped[itemType]);

			return success;
		});

		Functions.inventory.unequip.setCallback((player, itemId) => {
			const state = store.unequip(tostring(player.UserId), itemId);
			const itemType = itemId.split("_")[0] as keyof PlayerEquipped;

			const playerEquipped = state.players.equipped[`${player.UserId}`];
			const success = (playerEquipped && !!!playerEquipped[itemType].includes(itemId)) ?? false;

			print(success, playerEquipped && playerEquipped[itemType]);

			return success;
		});

		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(3);
		Functions.inventory.unequip.predict(Players.GetPlayers()[0], "emote_1");
	}
}
