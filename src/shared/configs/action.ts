export type Action = {
	id: number;
	name: string;
	callback: (args: { fromPlayer: Player; toPlayer: Player }) => void;
};

export const divine = [
	{
		id: 1,
		name: "Ragdoll Player",
		callback: ({ fromPlayer, toPlayer }) => {
			toPlayer.Kick();
		},
	},
] as const satisfies Action[];

export const deviousLicks = [
	{
		id: 2320616747,
		name: "Ragdoll Player",
		callback: ({ fromPlayer, toPlayer }) => {
			fromPlayer.Kick();
		},
	},
] as const satisfies Action[];

export type ActionId = (typeof divine)[number]["id"] | (typeof deviousLicks)[number]["id"];
