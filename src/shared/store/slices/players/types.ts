import BaseItem from "shared/Items/BaseItem";
import { Currency } from "shared/configs/Currency";

export interface PlayerData {
	loggedIn: PlayerLoggedIn;
	balance: PlayerBalance;
	items: PlayerItems;
	equipped: PlayerEquipped;
}

export type PlayerEquipped = {
	outfitId: BaseItem["id"] | undefined;
};

export type PlayerItems = BaseItem["id"][];

export type PlayerLoggedIn = {
	// os.date("!*t").yday;
	last: number | undefined;
	total: number;
};

export type PlayerBalance = Record<Currency, number>;
