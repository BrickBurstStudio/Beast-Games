import { Events } from "server/network";
import { ANNOUNCER_CONFIGS } from "shared/configs/announcer";

export function announce(announcements: string[], richTextReplace?: { [key: string]: string }): Promise<void> {
	return new Promise<void>((resolve) => {
		task.spawn(() => {
			Events.announcer.announce.broadcast(announcements, richTextReplace);

			for (const announcement of announcements) {
				task.wait(ANNOUNCER_CONFIGS.preMessageTime);
				task.wait(announcement.size() * ANNOUNCER_CONFIGS.keystrokeTime * 2);
				task.wait(ANNOUNCER_CONFIGS.postMessageTime);
			}
			task.wait(ANNOUNCER_CONFIGS.animationTime);
			task.wait();

			resolve();
		});
	});
}
