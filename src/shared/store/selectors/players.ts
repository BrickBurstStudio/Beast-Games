import { createSelector } from "@rbxts/reflex";
import { Currency } from "shared/configs/currency";
import { SharedState } from "..";
import { PlayerData, PlayerEquipped } from "../slices/players/types";
import { defaultPlayerData } from "../slices/players/utils";
import { playTimeSlice } from "../slices/players/playTime";
import { ItemId } from "shared/configs/items";

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

export const selectItem = (playerId: string, itemId: ItemId) => {
	return createSelector(selectItems(playerId), (items) => {
		return items && items.includes(itemId);
	});
};

export const selectEquipped = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.equipped[playerId];
	};
};

export const selectEquippedType = (playerId: string, itemType: keyof PlayerEquipped) => {
	return createSelector(selectEquipped(playerId), (equipped) => {
		return equipped && equipped[itemType];
	});
};

export const selectXP = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.xp[playerId];
	};
};

export const selectWins = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.wins[playerId];
	};
};

export const selectPlayTime = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.playTime[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(
		selectPlayerBalances(playerId),
		selectLoggedIns(playerId),
		selectItems(playerId),
		selectEquipped(playerId),
		selectXP(playerId),
		selectWins(playerId),
		selectPlayTime(playerId),
		(balances, loggedIns, items, equipped, xp, wins, playTime): PlayerData => {
			return {
				loggedIn: loggedIns || defaultPlayerData.loggedIn,
				balance: balances || defaultPlayerData.balance,
				items: items || defaultPlayerData.items,
				equipped: equipped || defaultPlayerData.equipped,
				xp: xp || defaultPlayerData.xp,
				wins: wins || defaultPlayerData.wins,
				playTime: playTime || defaultPlayerData.playTime,
			};
		},
	);
};
