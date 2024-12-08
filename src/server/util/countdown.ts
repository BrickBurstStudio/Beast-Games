import { Events } from "server/network";
import { Countdown } from "shared/network";

export async function countdown({
	seconds,
	description,
	showGo,
	player,
}: Pick<Countdown, "description" | "showGo"> & { seconds: number; player?: Player }) {
	return new Promise<void>((resolve) => {
		for (let i = seconds; i >= 0; i--) {
			if (player) {
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
	});
}
