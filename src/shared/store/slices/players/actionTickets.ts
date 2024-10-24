import { createProducer } from "@rbxts/reflex";
import { PlayerData } from "./types";
import { defaultPlayerData } from "./utils";
import { ActionId } from "shared/configs/action";

// Rename the interface to ActionTicketsState
export interface ActionTicketsState {
	readonly [player: string]: ActionId[] | undefined;
}

const initialState: ActionTicketsState = {};

// Rename the slice to actionTicketsSlice
export const actionTicketsSlice = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.actions,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	reset: (state, playerId: string) => {
		return {
			...state,
			[playerId]: defaultPlayerData.actions,
		};
	},

	// Rename to addActionTicket
	addActionTicket: (state, player: string, actionId: ActionId) => {
		const actions = state[player] || [];
		return {
			...state,
			[player]: [...actions, actionId],
		};
	},

	// Rename to removeActionTicket
	removeActionTicket: (state, player: string, actionId: ActionId) => {
		const actions = state[player] || [];
		const index = actions.indexOf(actionId);
		if (index === -1) return state;
		actions.remove(index);
		return {
			...state,
			[player]: actions,
		};
	},
});
