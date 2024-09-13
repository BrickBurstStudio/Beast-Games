import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerLoggedIn } from "./types";
import { defaultPlayerData } from "./utils";

export interface LoggedInState {
	readonly [player: string]: PlayerLoggedIn | undefined;
}

const initialState: LoggedInState = {};

export const loggededInSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.loggedIn,
	}),

	closePlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	reset: (state, playerId: string) => {
		return {
			...state,
			[playerId]: defaultPlayerData.loggedIn,
		};
	},

	logIn: (state, playerId: string) => {
		const loggedIn = state[playerId];

		return {
			...state,
			[playerId]: loggedIn && {
				...loggedIn,
				total: loggedIn.total + 1,
				last: os.date("!*t").yday,
			},
		};
	},
});
