import { Events } from "server/network";
import { RULES_CONFIGS } from "shared/configs/announcer";

export async function announceRules({ challengeName, rules }: { challengeName: string; rules: string[] }) {
	return new Promise<void>((resolve) => {
		task.spawn(() => {
			for (let i = 0; i < rules.size(); i++) {
				Events.announcer.showRule.broadcast({
					challengeName,
					rules,
					index: i,
				});
				task.wait(RULES_CONFIGS.timePerRule + RULES_CONFIGS.animationTime);
			}
			Events.announcer.hideRules.broadcast();
			task.wait(RULES_CONFIGS.timeAfterRules + RULES_CONFIGS.animationTime + 0.5);
			resolve();
		});
	});
}
