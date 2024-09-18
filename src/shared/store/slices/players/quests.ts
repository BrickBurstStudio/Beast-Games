import { createProducer } from "@rbxts/reflex";
import { Currency } from "shared/configs/currency";
import { PlayerBalance, PlayerData, PlayerQuests, QuestData } from "./types";
import { defaultPlayerData } from "./utils";
import { quests } from "shared/configs/quests";
import { HttpService } from "@rbxts/services";

export interface questsState {
	readonly [player: string]: PlayerQuests | undefined;
}

const initialState: questsState = {};

export const questsSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.quests,
	}),

	closePlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	reset: (state, playerId: string) => {
		return {
			...state,
			[playerId]: defaultPlayerData.quests,
		};
	},

	addQuest: (state, playerId: string, questId: (typeof quests)[number]["id"]) => {
		const quests = state[playerId];

		return {
			...state,
			[playerId]: quests && {
				...quests,
				[questId]: { targets: 0, issuedAt: DateTime.now().UnixTimestamp } as QuestData,
			},
		};
	},

	removeQuest: (state, playerId: string, questId: (typeof quests)[number]["id"]) => {
		const quests = state[playerId];
		if (!quests?.[questId]) {
			warn(`Quest ID ${questId} does not exist for player ${playerId}`);
			return state;
		}

		return {
			...state,
			[playerId]: { ...quests, [questId]: undefined },
		};
	},

	incrementTarget: (state, playerId: string, questId: (typeof quests)[number]["id"]) => {
		const quests = state[playerId];
		if (!quests?.[questId]) {
			warn(`Quest ID ${questId} does not exist for player ${playerId}`);
			return state;
		}

		return {
			...state,
			[playerId]: quests && {
				...quests,
				[questId]: { targets: quests[questId].targets + 1, issuedAt: quests[questId].issuedAt },
			},
		};
	},
});
