/* eslint-disable no-unused-vars */
import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
// import BaseItem from "shared/components/Items/BaseItem";

import { Dare } from "server/util/createDare";
import { EquippableItemId, Item } from "./configs/items";
import { Case, cases } from "./configs/items/cases";
import { quests } from "./configs/quests";
import { PlayerData, PlayerQuests, QuestData } from "./store/slices/players/types";
import { Currency } from "./configs/currency";

type updateLeaderboardsArgs = {
	xp: { key: string; value: number }[];
	playTime: { key: string; value: number }[];
	wins: { key: string; value: number }[];
	cash: { key: string; value: number }[];
	gems: { key: string; value: number }[];
	honor: { key: string; value: number }[];
};

interface ServerEvents {
	reflex: {
		start: () => void;
	};
}

interface ServerFunctions {
	inventory: {
		openCase: (caseId: (typeof cases)[number]["id"]) => Item;
		equip: (itemId: EquippableItemId) => boolean;
		unequip: (itemId: EquippableItemId) => boolean;
	};

	purchase: {
		case: (caseId: (typeof cases)[number]["id"]) => void;
		action: () => void;
	};
}

interface ClientEvents {
	announcer: {
		announce: (announcements: string[]) => void;
	};
	quests: {
		addQuest: (quest: (typeof quests)[number]["id"], questData: QuestData) => void;
		removeQuest: (quest: (typeof quests)[number]["id"], questData: QuestData) => void;
		incrementTarget: (quest: (typeof quests)[number]["id"], questData: QuestData) => void;
		initQuests: (quests: PlayerQuests) => void;
	};
	reflex: {
		dispatch: (actions: Array<BroadcastAction>) => void;
		hydrate: (actions: PlayerData) => void;
		start: () => void;
	};
	dares: {
		dareCreated: (dare: Dare) => void;
		dareCompleted: (dare: Dare) => void;
		targetCompleted: (dare: Dare) => void;
	};

	animations: {
		levelUp: (level: number) => void;
		recieveCurrency: (args: {
			currency: Currency;
			amount: number;
		}) => void;
	};

	updateLeaderboards: (args: updateLeaderboardsArgs) => void;

	createChallenge: (name: string) => void;

	animateUnboxing: (args: { targetPlayer: Player; caseObject: Case; item: Item }) => void;
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
