/* eslint-disable no-unused-vars */
import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
// import BaseItem from "shared/components/Items/BaseItem";

import { EquippableItemId, Item } from "./configs/items";
import { cases } from "./configs/items/cases";
import { PlayerData, PlayerQuests, QuestData } from "./store/slices/players/types";
import { Dare } from "server/util/createDare";
import { quests } from "./configs/quests";

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
	quests: {
		addQuest: (quest: (typeof quests)[number]["id"], questData: QuestData) => void;
		removeQuest: (quest: (typeof quests)[number]["id"], questData: QuestData) => void;
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

	levelUpPlayer: (level: number) => void;

	updateLeaderboards: (args: updateLeaderboardsArgs) => void;

	createChallenge: (name: string) => void;

	// announceMessage: ({ ...args }: Announcement) => void;

	animateUnboxing: ({ ...args }: { targetPlayer: Player; unboxModel: Model; itemModel: Model }) => void;
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
