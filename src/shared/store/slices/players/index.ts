import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "./balance";
import { loggededInSlice } from "./loggedIn";
import { itemsSlice } from "./items";
import { equippedSlice } from "./equipped";

export const playersSlice = combineProducers({
  balance: balanceSlice,
  loggedIn: loggededInSlice,
  items: itemsSlice,
  equipped: equippedSlice,
});
