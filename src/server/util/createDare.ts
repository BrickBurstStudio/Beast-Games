import { Events } from "server/network";
import { Currency } from "shared/configs/currency";

export function createDare(dare: Dare, rewardFunc: (player: Player) => void) {
	let targetsCompleted = 0;
	let dareCompleted = false;
	Events.dares.dareCreated.broadcast(dare);

	return (player: Player) => {
		if (dareCompleted) return;
		targetsCompleted += 1;

		if (targetsCompleted >= dare.targets) {
			Events.dares.dareCompleted(player, dare);
			dareCompleted = true;
			rewardFunc(player);
		} else {
			Events.dares.targetCompleted(player, dare);
		}
	};
}
export type Dare = {
	name: string;
	description: string;
	reward: Currency | "xp";
	targets: number;
};
