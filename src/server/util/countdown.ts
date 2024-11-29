import { Events } from "server/network";
import { Countdown } from "shared/network";

export async function countdown({ seconds, description, showGo }: Countdown) {
	return new Promise<void>((resolve) => {
		Events.announcer.countdown.broadcast({
			seconds,
			description,
			showGo,
		});
		task.spawn(() => {
			task.wait(seconds + 2);
			resolve();
		});
	});
}
