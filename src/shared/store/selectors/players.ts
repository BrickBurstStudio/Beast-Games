import { createSelector } from "@rbxts/reflex";
import { Currency } from "shared/configs/Currency";
import { SharedState } from "..";
import { PlayerData } from "../slices/players/types";
import { defaultPlayerData } from "../slices/players/utils";

export const selectPlayerBalances = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.balance[playerId];
	};
};

export const selectPlayerBalance = (playerId: string, currency: Currency) => {
	return createSelector(selectPlayerBalances(playerId), (balances) => {
		return balances && balances[currency];
	});
};

export const selectLoggedIns = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.loggedIn[playerId];
	};
};

export const selectLoggedIn = (playerId: string, key: keyof PlayerData["loggedIn"]) => {
	return createSelector(selectLoggedIns(playerId), (loggedIn) => {
		return loggedIn && loggedIn[key];
	});
};

export const selectItems = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.items[playerId];
	};
};

export const selectItem = (playerId: string, itemId: string) => {
	return createSelector(selectItems(playerId), (items) => {
		return items && items.includes(itemId);
	});
};

export const selectEquipped = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.equipped[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(
		selectPlayerBalances(playerId),
		selectLoggedIns(playerId),
		selectItems(playerId),
		selectEquipped(playerId),
		(balances, loggedIns, items, equipped): PlayerData => {
			return {
				loggedIn: loggedIns || defaultPlayerData.loggedIn,
				balance: balances || defaultPlayerData.balance,
				items: items || defaultPlayerData.items,
				equipped: equipped || defaultPlayerData.equipped,
			};
		},
	);
};
