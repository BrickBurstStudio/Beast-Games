/* eslint-disable no-unused-vars */
import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
// import BaseItem from "shared/components/Items/BaseItem";

import { EquippableItemId } from "./configs/items";
import { cases } from "./configs/items/cases";
import { PlayerData } from "./store/slices/players/types";

type updateLeaderboardsArgs = {
	xp: { key: string; value: number }[];
	playTime: { key: string; value: number }[];
	wins: { key: string; value: number }[];
};

interface ServerEvents {
	reflex: {
		start: () => void;
	};
}

interface ServerFunctions {
	inventory: {
		equip: (itemId: EquippableItemId) => boolean;
		unequip: (itemId: EquippableItemId) => boolean;
	};

	purchase: {
		case: (caseId: (typeof cases)[number]["id"]) => string | void;
		action: () => string | void;
	};
}

interface ClientEvents {
	reflex: {
		dispatch: (actions: Array<BroadcastAction>) => void;
		hydrate: (actions: PlayerData) => void;
		start: () => void;
	};

	updateLeaderboards: (args: updateLeaderboardsArgs) => void;

	createChallenge: (name: string) => void;

	// announceMessage: ({ ...args }: Announcement) => void;

	animateUnboxing: ({ ...args }: { targetPlayer: Player; unboxModel: Model; itemModel: Model }) => void;
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
