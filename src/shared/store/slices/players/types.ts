import { Currency } from "shared/configs/currency";
import { ItemId } from "shared/configs/items";
import { hats } from "shared/configs/items/hats";

export interface PlayerData {
	loggedIn: PlayerLoggedIn;
	balance: PlayerBalance;
	items: PlayerItems;
	equipped: PlayerEquipped;
	xp: number;
	wins: number;
	playTime: number;
	actionTokens: number;
}

export type PlayerEquipped = {
	hat: (typeof hats)[number]["id"] | undefined;
};

export type PlayerItems = ItemId[];

export type PlayerLoggedIn = {
	// os.date("!*t").yday;
	last: number | undefined;
	total: number;
};

export type PlayerBalance = Record<Currency, number>;
