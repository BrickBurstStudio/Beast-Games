import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "./balance";
import { settingsSlice } from "./settings";
import { loggededInSlice } from "./loggedIn";
import { itemsSlice } from "./items";
import { equippedSlice } from "./equipped";

export const playersSlice = combineProducers({
  balance: balanceSlice,
  settings: settingsSlice,
  loggedIn: loggededInSlice,
  items: itemsSlice,
  equipped: equippedSlice,
});
