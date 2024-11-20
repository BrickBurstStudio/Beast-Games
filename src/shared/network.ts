/* eslint-disable no-unused-vars */
import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
// import BaseItem from "shared/components/Items/BaseItem";

import { Dare } from "../../types/Dare";
import { ActionId } from "./configs/action";
import { Currency } from "./configs/currency";
import { EquippableItemId, Item } from "./configs/items";
import { Case, cases } from "./configs/items/cases";
import { PlayerData } from "./store/slices/players/types";

type updateLeaderboardsArgs = {
	xp: { key: string; value: number }[];
	playTime: { key: string; value: number }[];
	wins: { key: string; value: number }[];
	cash: { key: string; value: number }[];
};

interface ServerEvents {
	reflex: {
		start: () => void;
	};
	challenges: {
		boulderChallenge: {
			pull: () => void;
		};
	};
	useAction: (args: { actionId: ActionId; toPlayer: Player }) => void;

	exitQueue: () => void;
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
	challenges: {
		moneyPileChallenge: {
			growMoney: () => void;
			dropMoney: (model: Model) => void;
		};
	};

	announcer: {
		announce: (announcements: string[], richTextReplace?: { [key: string]: string }) => void;
		announceRules: (args: { challengeName: string; rules: string[] }) => void;
		countdown: (countdown: Countdown) => void;
		clearCountdown: () => void;
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
		startChallenge: () => void;
		endChallenge: () => void;
		levelUp: (level: number) => void;
		recieveCurrency: (args: { currency: Currency; amount: number }) => void;
	};

	updateLeaderboards: (args: updateLeaderboardsArgs) => void;

	createChallenge: (name: string) => void;

	animateUnboxing: (args: { targetPlayer: Player; caseObject: Case; item: Item }) => void;

	animationController: {
		play: (animation: Animation) => void;
		stop: (animation: Animation) => void;
	};
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();

export type Countdown = {
	seconds: number;
	description?: string | undefined;
};
