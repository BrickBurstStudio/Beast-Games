import { OnStart, Service } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { Events, Functions } from "server/network";
import { store } from "server/store";
import { hats } from "shared/configs/items/hats";
import { selectEquippedType } from "shared/store/selectors/players";
import { PlayerEquipped } from "shared/store/slices/players/types";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

@Service()
export class EquipService implements OnStart {
	onStart() {
		Functions.inventory.equip.setCallback((player, itemId) => {
			const state = store.equip(tostring(player.UserId), itemId);
			const itemType = itemId.split("_")[0] as keyof PlayerEquipped;

			const playerEquipped = state.players.equipped[`${player.UserId}`];
			const itemIsEquipped = (playerEquipped && !!playerEquipped[itemType]) ?? false;

			print(itemIsEquipped, playerEquipped && playerEquipped[itemType]);

			return itemIsEquipped;
		});

		while (Players.GetPlayers().size() < 1) task.wait();
		task.wait(3);
		Functions.inventory.equip.predict(Players.GetPlayers()[0], "emote_1");
	}
}
