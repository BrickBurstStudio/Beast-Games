import { createProducer } from "@rbxts/reflex";
import { PlayerData } from "./types";
import { defaultPlayerData } from "./utils";

export interface ActionTokensState {
	readonly [player: string]: number | undefined;
}

const initialState: ActionTokensState = {};

export const actionTokensSlice = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.actionTokens,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	reset: (state, playerId: string) => {
		return {
			...state,
			[playerId]: defaultPlayerData.actionTokens,
		};
	},

	addActionTokens: (state, player: string, amount: number) => {
		const current = state[player] ?? 0;
		return {
			...state,
			[player]: current + amount,
		};
	},

	removeActionTokens: (state, player: string, amount: number) => {
		const current = state[player] ?? 0;
		if (current < amount) return state;
		return {
			...state,
			[player]: current - amount,
		};
	},
});
