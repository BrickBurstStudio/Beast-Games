import { createSelector } from "@rbxts/reflex";
import { Currency } from "shared/configs/currency";
import { ItemId } from "shared/configs/items";
import { SharedState } from "..";
import { PlayerData, PlayerEquipped } from "../slices/players/types";
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

export const selectPlayerLoggedIns = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.loggedIn[playerId];
	};
};

export const selectPlayerLoggedIn = (playerId: string, key: keyof PlayerData["loggedIn"]) => {
	return createSelector(selectPlayerLoggedIns(playerId), (loggedIn) => {
		return loggedIn && loggedIn[key];
	});
};

export const selectPlayerItems = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.items[playerId];
	};
};

export const selectPlayerItem = (playerId: string, itemId: ItemId) => {
	return createSelector(selectPlayerItems(playerId), (items) => {
		return items && items.includes(itemId);
	});
};

export const selectPlayerEquipped = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.equipped[playerId];
	};
};

export const selectPlayerEquippedType = (playerId: string, itemType: keyof PlayerEquipped) => {
	return createSelector(selectPlayerEquipped(playerId), (equipped) => {
		return equipped && equipped[itemType];
	});
};

export const selectPlayerXP = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.xp[playerId];
	};
};

export const selectPlayerWins = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.wins[playerId];
	};
};

export const selectPlayerPlayTime = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.playTime[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(
		selectPlayerBalances(playerId),
		selectPlayerLoggedIns(playerId),
		selectPlayerItems(playerId),
		selectPlayerEquipped(playerId),
		selectPlayerXP(playerId),
		selectPlayerWins(playerId),
		selectPlayerPlayTime(playerId),
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
