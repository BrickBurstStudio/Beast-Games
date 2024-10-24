import { ActionId } from "shared/configs/action";
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
	actions: ActionId[];
}

export interface ProfileData extends Omit<PlayerData, "quests"> {
	quests: string;
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

export type QuestData = { targets: number; issuedAt: number };
export type PlayerQuests = Partial<Record<(typeof quests)[number]["id"], QuestData>>;
