import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerEquipped } from "./types";
import { defaultPlayerData } from "./utils";
import BaseItem from "shared/classes/items/BaseItem";

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

	equip: (state, playerId: string, itemId: BaseItem["id"]) => {
		const itemType = itemId.split("_")[0];
		const equipped = state[playerId];

		return {
			...state,
			[playerId]: equipped && {
				...equipped,
				[itemType]: itemId,
			},
		};
	},
});
