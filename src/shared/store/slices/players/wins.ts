import { createProducer } from "@rbxts/reflex";
import { Currency } from "shared/configs/Currency";
import { PlayerBalance, PlayerData } from "./types";
import { defaultPlayerData } from "./utils";

export interface winsState {
	readonly [player: string]: number | undefined;
}

const initialState: winsState = {};

export const winsSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.wins,
	}),

	closePlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	reset: (state, playerId: string) => {
		return {
			...state,
			[playerId]: defaultPlayerData.wins,
		};
	},

	incrementWins: (state, playerId: string, amount: number) => {
		if (amount < 0) warn("Wins should never be decremented.");

		const wins = state[playerId];

		return {
			...state,
			[playerId]: wins && wins + amount,
		};
	},
});
