import { createProducer } from "@rbxts/reflex";
import { hats } from "shared/configs/items/hats";
import { PlayerData, PlayerEquipped } from "./types";
import { defaultPlayerData } from "./utils";

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

	equipHat: (state, playerId: string, hatId: (typeof hats)[number]["id"]) => {
		const equipped = state[playerId];
		if (!equipped) return state;

		return {
			...state,
			[playerId]: {
				hat: hatId,
			},
		};
	},

	unequipHat: (state, playerId: string) => {
		const equipped = state[playerId];
		if (!equipped) return state;

		return {
			...state,
			[playerId]: {
				hat: undefined,
			},
		};
	},
});
