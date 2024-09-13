import { createProducer } from "@rbxts/reflex";
import BaseItem from "shared/Items/BaseItem";
import { PlayerData, PlayerEquipped } from "./types";

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

	equip: (state, playerId: string, itemId: BaseItem["id"]) => {
		const equipped = state[playerId];

		return {
			...state,
			[playerId]: equipped && {
				...equipped,
				outfitId: itemId,
			},
		};
	},
});
