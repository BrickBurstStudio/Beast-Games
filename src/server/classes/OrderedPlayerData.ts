// import { print } from "rbxts-transform-debug";

import { selectPlayerData } from "shared/store/selectors/players";
import { getLevel } from "shared/utils/functions/getLevel";
import { BaseOrderedDataStore } from "./BaseOrderedDataStore";
import { store } from "server/store";

export class OrderedPlayerData {
	player: Player;
	//TODO: Handle base orderd data in reflex
	xp: BaseOrderedDataStore;
	wins: BaseOrderedDataStore;
	playTime: BaseOrderedDataStore;
	gems: BaseOrderedDataStore;
	honor: BaseOrderedDataStore;
	cash: BaseOrderedDataStore;

	constructor(player: Player) {
		if (player.UserId < 0) error(`Player ${player.Name} has a negative UserId! Please use real players.`);
		this.player = player;
		this.xp = new BaseOrderedDataStore(player.UserId, "xp", (amount) =>
			store.changeXP(tostring(player.UserId), amount),
		);
		this.wins = new BaseOrderedDataStore(player.UserId, "wins", (amount) =>
			store.incrementWins(tostring(player.UserId), amount),
		);
		this.gems = new BaseOrderedDataStore(player.UserId, "gems", (amount) =>
			store.changeBalance(tostring(player.UserId), "gems", amount),
		);
		this.cash = new BaseOrderedDataStore(player.UserId, "cash", (amount) =>
			store.changeBalance(tostring(player.UserId), "cash", amount),
		);
		this.honor = new BaseOrderedDataStore(player.UserId, "honor", (amount) =>
			store.changeBalance(tostring(player.UserId), "honor", amount),
		);
		this.playTime = new BaseOrderedDataStore(player.UserId, "playTime", (amount) =>
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

	CheckDailyRewards() {
		const today = os.date("!*t").yday;
		let rewarded = true;
		const playerData = store.getState(selectPlayerData(tostring(this.player.UserId)));

		// if (!playerData.loggedIn.last) {
		// 	// first time logging in
		// 	// give welcome rewards
		// 	this.xp.UpdateBy(75);
		// 	store.changeBalance(tostring(this.player.UserId), "coins", 188);
		// 	print(`Player ${this.player.UserId} (${this.player.Name}) has logged in for the first time!`);
		// } else if (playerData.loggedIn.last !== today) {
		// 	// player has logged in on a new day
		// 	// give daily rewards
		// 	this.xp.UpdateBy(25);
		// 	store.changeBalance(tostring(this.player.UserId), "coins", 63);
		// 	print(`Player ${this.player.UserId} (${this.player.Name}) has logged in today!`);
		// } else {
		// 	// player has already logged in today. cringe. get a job
		// 	print(`Player ${this.player.UserId} (${this.player.Name}) has already logged in today!`);
		// 	rewarded = false;
		// }

		// store.logIn(tostring(this.player.UserId));
		return rewarded;
	}
}
