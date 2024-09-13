import { createProducer } from "@rbxts/reflex";
import { Currency } from "shared/configs/Currency";
import { PlayerBalance, PlayerData } from "./types";
import { defaultPlayerData } from "./utils";

export interface BalanceState {
	readonly [player: string]: PlayerBalance | undefined;
}

const initialState: BalanceState = {};

export const balanceSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.balance,
	}),

	closePlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),
	reset: (state, playerId: string) => {
		return {
			...state,
			[playerId]: defaultPlayerData.balance,
		};
	},

	changeBalance: (state, playerId: string, currency: Currency, amount: number) => {
		const balance = state[playerId];

		return {
			...state,
			[playerId]: balance && {
				...balance,
				[currency]: balance[currency] + amount,
			},
		};
	},
});
