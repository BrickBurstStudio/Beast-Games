import { Events } from "server/network";
import { Countdown } from "shared/network";

const cancellationRefs = new Map<Player, boolean>();
let globalCancellationRef = false;

export async function countdown({
	seconds,
	description,
	showGo,
	player,
}: Pick<Countdown, "description" | "showGo"> & { seconds: number; player?: Player }) {
	return new Promise<void>((resolve, reject) => {
		spawn(() => {
			for (let i = seconds; i >= 0; i--) {
				if (globalCancellationRef) {
					globalCancellationRef = false;
					return resolve();
				}
				if (player) {
					if (cancellationRefs.get(player)) {
						cancellationRefs.delete(player);
						return resolve();
					}

					Events.announcer.countdown.fire(player, {
						second: i,
						description,
						showGo,
					});
				} else {
					Events.announcer.countdown.broadcast({
						second: i,
						description,
						showGo,
					});
				}
				task.wait(1);
			}
			resolve();
		});
	});
}

export function cancelCountdown(player?: Player) {
	if (player) {
		cancellationRefs.set(player, true);
		Events.announcer.clearCountdown.fire(player);
	} else {
		globalCancellationRef = true;
		Events.announcer.clearCountdown.broadcast();
	}
}
