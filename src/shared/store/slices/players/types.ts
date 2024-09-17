import { Currency } from "shared/configs/currency";
import { EquippableItemId, EquippableItemType, ItemId, ItemType } from "shared/configs/items";
import { quests } from "shared/configs/quests";

export interface PlayerData {
	loggedIn: PlayerLoggedIn;
	balance: PlayerBalance;
	items: PlayerItems;
	equipped: PlayerEquipped;
	xp: number;
	wins: number;
	playTime: number;
	quests: PlayerQuests;
}

export type PlayerEquipped = {
	[K in EquippableItemType]: EquippableItemId[];
};

export type PlayerItems = ItemId[];

export type PlayerLoggedIn = {
	// os.date("!*t").yday;
	last: number | undefined;
	total: number;
};

export type PlayerBalance = Record<Currency, number>;

type QuestData = { targets: number; issuedAt: DateTime };
export type PlayerQuests = Partial<Record<(typeof quests)[number]["id"], QuestData>>;
