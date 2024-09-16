import { createProducer } from "@rbxts/reflex";
import { Currency } from "shared/configs/currency";
import { PlayerBalance, PlayerData } from "./types";
import { defaultPlayerData } from "./utils";

export interface xpState {
	readonly [player: string]: number | undefined;
}

const initialState: xpState = {};

export const xpSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.xp,
	}),

	closePlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	reset: (state, playerId: string) => {
		return {
			...state,
			[playerId]: defaultPlayerData.xp,
		};
	},

	changeXP: (state, playerId: string, amount: number) => {
		const xp = state[playerId];

		return {
			...state,
			[playerId]: !!xp ? xp + amount : xp,
		};
	},
});
