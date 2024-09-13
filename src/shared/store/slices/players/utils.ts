import { PlayerData } from "./types";

export const defaultPlayerData: PlayerData = {
	equipped: {
		outfitId: undefined,
	},
	loggedIn: {
		last: undefined,
		total: 0,
	},
	balance: {
		cash: 0,
		gems: 0,
		honor: 0,
	},
	items: [],
	xp: 0,
	wins: 0,
	playTime: 0,
};
