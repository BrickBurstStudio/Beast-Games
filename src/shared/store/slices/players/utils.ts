import { PlayerData } from "./types";

export const defaultPlayerData: PlayerData = {
	equipped: {
		hat: undefined,
	},
	loggedIn: {
		last: undefined,
		total: 0,
	},
	balance: {
		cash: 0,
		action_token: 0,
	},
	items: [],
	xp: 0,
	wins: 0,
	playTime: 0,
};
