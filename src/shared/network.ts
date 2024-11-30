/* eslint-disable no-unused-vars */
import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
// import BaseItem from "shared/components/Items/BaseItem";

import { BribeChallengeData } from "../../types/BribeChallengeData";
import { Dare } from "../../types/Dare";
import { ActionName } from "./configs/action";
import { Currency } from "./configs/currency";
import { Item } from "./configs/items";
import { Case, cases } from "./configs/items/cases";
import { hats } from "./configs/items/hats";
import { PlayerData } from "./store/slices/players/types";

type updateLeaderboardsArgs = {
	xp: { key: string; value: number }[];
	playTime: { key: string; value: number }[];
	wins: { key: string; value: number }[];
	cash: { key: string; value: number }[];
};

export type InputData = { origin: Vector3; direction: Vector3 };

interface ServerEvents {
	reflex: {
		start: () => void;
	};
	challenges: {
		boulderChallenge: {
			pull: () => void;
		};
		bribeChallenge: {
			acceptBribe: () => void;
		};
		splitOrStealChallenge: {
			makeChoice: (choice: "split" | "steal") => void;
		};
	};
	useAction: (args: { actionName: ActionName; toPlayer: Player }) => void;
	reset: () => void;
	exitQueue: () => void;
	inputActivated: (inputData: InputData) => void;
}

interface ServerFunctions {
	inventory: {
		openCase: (caseId: (typeof cases)[number]["id"]) => Item;
		equip: (itemId: (typeof hats)[number]["id"]) => boolean;
		unequip: (itemId: (typeof hats)[number]["id"]) => boolean;
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
		bribeChallenge: {
			updateBribe: (args: BribeChallengeData) => void;
			disableBribe: () => void;
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
		levelUp: (level: number) => void;
		recieveCurrency: (args: { currency: Currency; amount: number }) => void;
		setBlackFade: (value: boolean) => void;
	};

	updateLeaderboards: (args: updateLeaderboardsArgs) => void;

	createChallenge: (name: string) => void;

	animateUnboxing: (args: { targetPlayer: Player; caseObject: Case; item: Item }) => void;

	animationController: {
		play: (animation: Animation) => void;
		stop: (animation: Animation) => void;
	};

	updateQueue: (playersInQueue: number) => void;
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();

export type Countdown = {
	seconds: number;
	description?: string | undefined;
	showGo?: boolean;
};
