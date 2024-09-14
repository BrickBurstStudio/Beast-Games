import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerEquipped } from "./types";
import { defaultPlayerData } from "./utils";
import { EquippableItemId, EquippableItemType, ItemId, ItemMaxEquipped, ItemType } from "shared/configs/items";

export interface EquippedState {
	readonly [player: string]: PlayerEquipped | undefined;
}

const initialState: EquippedState = {};

export const equippedSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.equipped,
	}),

	closePlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	reset: (state, playerId: string) => {
		return {
			...state,
			[playerId]: defaultPlayerData.equipped,
		};
	},

	equip: (state, playerId: string, itemId: EquippableItemId) => {
		const itemType = itemId.split("_")[0] as keyof PlayerEquipped;
		const equipped = state[playerId];

		return {
			...state,
			[playerId]: equipped &&
				equipped[itemType] && {
					...equipped,
					[itemType]: [
						...equipped[itemType].filter((_, i) => i + 1 < ItemMaxEquipped[itemType]).filterUndefined(),
						itemId,
					],
				},
		};
	},

	unequip: (state, playerId: string, itemId: EquippableItemId) => {
		const itemType = itemId.split("_")[0] as keyof PlayerEquipped;
		const equipped = state[playerId];

		return {
			...state,
			[playerId]: equipped &&
				equipped[itemType] && {
					...equipped,
					[itemType]: [...equipped[itemType].filter((id) => id !== itemId).filterUndefined()],
				},
		};
	},
});
