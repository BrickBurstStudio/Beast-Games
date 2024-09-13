import { CombineStates } from "@rbxts/reflex";
import { clientSlice } from "./slices/client";
import { playersSlice } from "./slices/players";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
  players: playersSlice,
  client: clientSlice,
};
