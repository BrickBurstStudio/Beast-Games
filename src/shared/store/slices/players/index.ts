import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "./balance";
import { loggededInSlice } from "./loggedIn";
import { itemsSlice } from "./items";
import { equippedSlice } from "./equipped";
import { xpSlice } from "./xp";
import { winsSlice } from "./wins";
import { playTimeSlice } from "./playTime";
import { questsSlice } from "./quests";

export const playersSlice = combineProducers({
	balance: balanceSlice,
	loggedIn: loggededInSlice,
	items: itemsSlice,
	equipped: equippedSlice,
	xp: xpSlice,
	wins: winsSlice,
	playTime: playTimeSlice,
	quests: questsSlice,
});
