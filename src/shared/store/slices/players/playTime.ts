import { createProducer } from "@rbxts/reflex";
import { Currency } from "shared/configs/Currency";
import { PlayerBalance, PlayerData } from "./types";
import { defaultPlayerData } from "./utils";

export interface playTimeState {
	readonly [player: string]: number | undefined;
}

const initialState: playTimeState = {};

export const playTimeSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.playTime,
	}),

	closePlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	incrementPlayTime: (state, playerId: string, amount: number) => {
		if (amount < 0) warn("Play Time should never be decremented.");
		const playTime = state[playerId];

		return {
			...state,
			[playerId]: playTime && playTime + amount,
		};
	},
});
