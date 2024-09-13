import { createProducer } from "@rbxts/reflex";
import BaseItem from "shared/Items/BaseItem";
import { PlayerData, PlayerItems } from "./types";

export interface ItemsState {
  readonly [player: string]: PlayerItems | undefined;
}

const initialState: ItemsState = {};

export const itemsSlice = createProducer(initialState, {
  loadPlayerData: (state, player: string, data: PlayerData) => ({
    ...state,
    [player]: data.items,
  }),

  closePlayerData: (state, player: string) => ({
    ...state,
    [player]: undefined,
  }),

  addItemToInventory: (state, player: string, itemId: BaseItem["id"]) => {
    const items = state[player] || [];
    return {
      ...state,
      [player]: [...items, itemId],
    };
  },

  removeItemFromInventory: (state, player: string, itemId: BaseItem["id"]) => {
    const items = state[player] || [];
    const index = items.indexOf(itemId);
    if (index === -1) return state;
    items.remove(index);
    return {
      ...state,
      [player]: items,
    };
  },

  resetInventory: (state, player: string) => {
    return {
      ...state,
      [player]: [],
    };
  },
});
