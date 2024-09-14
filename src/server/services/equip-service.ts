import { OnStart, Service } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { store } from "server/store";
import { items } from "shared/configs/items";
import { hats } from "shared/configs/items/hats";
import { selectEquipped, selectEquippedType } from "shared/store/selectors/players";
import { balanceSlice } from "shared/store/slices/players/balance";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

@Service()
class EquipService implements OnStart {
	onStart() {
		forEveryPlayer((p) => {
			const obliterator = new Janitor();
			obliterator.Add(
				store.subscribe(selectEquippedType(tostring(p.UserId), "hat"), (hat) => {
					const meshId = hats.find((h) => h.id === hat)?.meshId;
					if (!meshId) return;
					const clone = ReplicatedStorage.Assets.Accessory.Clone();
					clone.Parent = p.Character
				}),
			);
			Players.PlayerRemoving.Connect((p1) => {
				if (p === p1) {
					obliterator.Cleanup();
				}
			});
		});
	}
}
