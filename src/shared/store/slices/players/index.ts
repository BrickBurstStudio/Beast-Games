import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "./balance";
import { equippedSlice } from "./equipped";
import { itemsSlice } from "./items";
import { loggededInSlice } from "./loggedIn";
import { playTimeSlice } from "./playTime";
import { winsSlice } from "./wins";
import { xpSlice } from "./xp";

export const playersSlice = combineProducers({
	balance: balanceSlice,
	loggedIn: loggededInSlice,
	items: itemsSlice,
	equipped: equippedSlice,
	xp: xpSlice,
	wins: winsSlice,
	playTime: playTimeSlice,
});
