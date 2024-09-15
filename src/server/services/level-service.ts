import { OnStart, Service } from "@flamework/core";
import { store } from "server/store";
import { selectPlayerXP } from "shared/store/selectors/players";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getLevel } from "shared/utils/functions/getLevel";

@Service()
export class LevelService implements OnStart {
	onStart() {
		forEveryPlayer((player) => {
			task.wait(3);
			let previousLevel: number | undefined = undefined;
			store.once(selectPlayerXP(tostring(player.UserId)), (xp) => {
				if (!xp) return;
				previousLevel = getLevel(xp);
			});
			store.subscribe(selectPlayerXP(tostring(player.UserId)), (xp) => {
				if (previousLevel === undefined) return;
				if (!xp) return;
				const currentLevel = getLevel(xp);
				if (currentLevel > previousLevel) {
					this.distributeRewards(player);
					previousLevel = currentLevel;
				}
			});
		});
	}

	distributeRewards(player: Player) {
		store.changeBalance(tostring(player.UserId), "cash", 100_000);
		store.changeBalance(tostring(player.UserId), "gems", 100);
	}
}
