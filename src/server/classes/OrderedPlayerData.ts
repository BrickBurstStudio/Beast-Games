// import { print } from "rbxts-transform-debug";

import { store } from "server/store";
import { selectPlayerData } from "shared/store/selectors/players";
import { getLevel } from "shared/utils/functions/getLevel";
import { BaseOrderedDataStore } from "./BaseOrderedDataStore";

export class OrderedPlayerData {
	player: Player;
	// TODO: Handle base orderd data in reflex
	xp: BaseOrderedDataStore;
	wins: BaseOrderedDataStore;
	playTime: BaseOrderedDataStore;
	cash: BaseOrderedDataStore;

	constructor(player: Player) {
		this.player = player;
		this.xp = new BaseOrderedDataStore(player, "xp", (amount) => {
			print("Rewarding XP: ", amount);
			store.changeXP(tostring(player.UserId), amount);
		});
		this.wins = new BaseOrderedDataStore(player, "wins", (amount) =>
			store.incrementWins(tostring(player.UserId), amount),
		);
		this.cash = new BaseOrderedDataStore(player, "cash", (amount) =>
			store.changeBalance(tostring(player.UserId), "cash", amount),
		);
		this.playTime = new BaseOrderedDataStore(player, "playTime", (amount) =>
			store.incrementPlayTime(tostring(player.UserId), amount),
		);
	}

	GetLevel() {
		return getLevel(this.xp.Get());
	}

	GetAll() {
		// const xp = this.xp.Get();
		// const wins = this.wins.Get();
		// const playTime = this.playTime.Get();
		const playerData = store.getState(selectPlayerData(tostring(this.player.UserId)));

		return {
			...playerData,
			// xp,
			// wins,
			// playTime,
		};
	}
}
