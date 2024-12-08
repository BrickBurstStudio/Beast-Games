import { ChallengeName } from "./gui";

export type Action = {
	name: string;
	cost: number;
	blacklistedChallenges: ChallengeName[];
};

export const actions = [
	{
		name: "Add 3 Lives",
		cost: 1,
		blacklistedChallenges: ["King of the Hill", "Split or Steal"],
	},
	{
		name: "Fling",
		cost: 1,
		blacklistedChallenges: [],
	},
	{
		name: "Kidnap",
		cost: 1,
		blacklistedChallenges: [],
	},
	{
		name: "Giant Mode",
		cost: 1,
		blacklistedChallenges: [],
	},
	{
		name: "Boogie Bomb",
		cost: 1,
		blacklistedChallenges: [],
	},
	{
		name: "Glock 19",
		cost: 1,
		blacklistedChallenges: [],
	},
	{
		name: "Nuke",
		cost: 1,
		blacklistedChallenges: ["Split or Steal"],
	},
] as const satisfies Action[];

export type ActionName = (typeof actions)[number]["name"];
