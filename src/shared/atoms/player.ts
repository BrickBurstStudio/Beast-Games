import { atom } from "@rbxts/charm";
import Remap from "@rbxts/remap";

export type TPlayerData = {
	cash: number;
	gems: number;
	honor: number;
	xp: number;
	playTime: number;
};

export const defaultPlayerData: TPlayerData = {
	cash: 0,
	gems: 0,
	honor: 0,
	xp: 0,
	playTime: 0,
};

export const rootAtom = atom(new ReadonlyMap<Player["UserId"], TPlayerData>());

export function loadPlayer(userId: Player["UserId"], data: TPlayerData) {
	rootAtom((state) => Remap.set(state, userId, data));
}

export function unloadPlayer(userId: Player["UserId"]) {
	rootAtom((state) => Remap.delete(state, userId));
}
