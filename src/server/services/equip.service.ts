import { OnStart, Service } from "@flamework/core";
import { Functions } from "server/network";
import { store } from "server/store";
import { Item, items } from "shared/configs/items";
import { hats, isHat } from "shared/configs/items/hats";
import { selectPlayerEquipped } from "shared/store/selectors/players";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Service()
export class EquipService implements OnStart {
	private async waitForPlayerData(userId: string, maxWaitTime = 10): Promise<boolean> {
		const startTime = os.clock();
		while (os.clock() - startTime < maxWaitTime) {
			const equipped = store.getState().players.equipped[userId];
			if (equipped) return true;
			await Promise.delay(0.1);
		}
		warn(`[EquipService] Timed out waiting for player data for userId: ${userId}`);
		return false;
	}

	onStart() {
		Functions.inventory.equip.setCallback((player, itemId) => {
			const item = items.get(itemId);
			if (!item || !isHat(item)) return false;

			const state = store.equipHat(tostring(player.UserId), itemId);
			const playerEquipped = state.players.equipped[`${player.UserId}`];
			const success = playerEquipped?.hat === itemId;

			if (success) this.Equip(player, item);

			return success;
		});

		Functions.inventory.unequip.setCallback((player, itemId) => {
			const item = items.get(itemId);
			if (!item || !isHat(item)) return false;

			const state = store.unequipHat(tostring(player.UserId));
			const playerEquipped = state.players.equipped[`${player.UserId}`];
			const success = playerEquipped?.hat === undefined;

			if (success) this.Unequip(player, item);

			return success;
		});

		forEveryPlayer(async (player) => {
			const userId = tostring(player.UserId);
			const hasData = await this.waitForPlayerData(userId);
			if (!hasData) return;

			const equipped = store.getState().players.equipped[userId];
			if (!equipped || !equipped.hat) return;

			const item = items.get(equipped.hat);
			if (item) await this.Equip(player, item);
		});
	}

	async Equip(player: Player, item: Item) {
		const character = await getCharacter(player);
		const equipped = store.getState(selectPlayerEquipped(tostring(player.UserId)));

		if (isHat(item)) {
			if (equipped?.hat === item.id) this.Unequip(player, hats.find((hat) => hat.id === item.id)!);
			// Create and configure hat accessory
			const hatClone = item.model.Clone();
			hatClone.Parent = character;

			// Configure the hat's attachment
			const handle = hatClone.FindFirstChild("Handle") as BasePart;
			if (handle) {
				const hatAttachment = handle.FindFirstChild("HatAttachment") as Attachment;
				const headAttachment = character.Head.FindFirstChild("HatAttachment") as Attachment;

				if (hatAttachment && headAttachment) {
					// Align the attachments
					handle.CFrame = character.Head.CFrame.mul(
						headAttachment.CFrame.mul(hatAttachment.CFrame.Inverse()),
					);

					// Create weld to attach hat to head
					const weld = new Instance("WeldConstraint");
					weld.Part0 = handle;
					weld.Part1 = character.Head;
					weld.Parent = handle;
				}
			}
		}
	}

	async Unequip(player: Player, item: Item) {
		const character = await getCharacter(player);

		if (isHat(item)) {
			// Remove the hat accessory
			const existingHat = character.FindFirstChild(item.model.Name);
			if (existingHat) {
				existingHat.Destroy();
			}
		}
	}
}
