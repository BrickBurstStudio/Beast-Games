import { PlayerData } from "./types";

export const defaultPlayerData: PlayerData = {
	equipped: {
		emote: [],
		hat: [],
	},
	loggedIn: {
		last: undefined,
		total: 0,
	},
	balance: {
		cash: 0,
	},
	items: [],
	xp: 0,
	wins: 0,
	playTime: 0,
	actionTokens: 0,
};
