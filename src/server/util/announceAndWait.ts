import announceServer from "server/cmdr/commands/announceServer";
import { Events } from "server/network";
import { ANNOUNCER_CONFIGS } from "shared/configs/announcer";

export function announceAndWait(announcements: string[]) {
	Events.announcer.announce.broadcast(announcements);

	for (const announcement of announcements) {
		task.wait(ANNOUNCER_CONFIGS.preMessageTime);
		task.wait(announcement.size() * ANNOUNCER_CONFIGS.keystrokeTime * 2);
		task.wait(ANNOUNCER_CONFIGS.postMessageTime);
	}
	task.wait(ANNOUNCER_CONFIGS.animationTime);
	task.wait();
}
