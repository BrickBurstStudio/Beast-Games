import { Currency } from "./currency";

export type Quest = {
	id: `quest_${number}`;
	name: string;
	description: string;
	reward: Currency | "xp";
	amount: number;
	expiration: DateTime | undefined;
	targets: number;
};

export const quests = [
	{
		id: "quest_1",
		name: "Super Honorable",
		description: "Sacrifice yourself three times",
		reward: "cash",
		amount: 60_000,
		expiration: undefined,
		targets: 3,
	},
	{
		id: "quest_2",
		name: "Good Guy Gary",
		description: "Sacrifice yourself once",
		reward: "cash",
		amount: 20_000,
		expiration: undefined,
		targets: 3,
	},
] as const satisfies Quest[];
