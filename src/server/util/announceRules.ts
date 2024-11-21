import { Events } from "server/network";
import { RULES_CONFIGS } from "shared/configs/announcer";

export async function announceRules({ challengeName, rules }: { challengeName: string; rules: string[] }) {
	return new Promise<void>((resolve) => {
		Events.announcer.announceRules.broadcast({
			challengeName,
			rules,
		});

		task.spawn(() => {
			task.wait(
				RULES_CONFIGS.timeBetweenRules * rules.size() +
					RULES_CONFIGS.timeAfterRules +
					RULES_CONFIGS.animationTime * 2 +
					0.5, // network time
			);
			resolve();
		});
	});
}
