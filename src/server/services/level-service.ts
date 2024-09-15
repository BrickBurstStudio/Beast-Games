import { OnStart, Service } from "@flamework/core";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Events } from "server/network";
import { store } from "server/store";
import { selectPlayerXP } from "shared/store/selectors/players";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getLevel } from "shared/utils/functions/getLevel";

@Service()
export class LevelService implements OnStart {
	onStart() {
		forEveryPlayer((player) => {
			let previousLevel: number | undefined = undefined;

			store.subscribe(selectPlayerXP(tostring(player.UserId)), (xp) => {
				if (!xp) return;
				if (previousLevel === undefined) return (previousLevel = getLevel(xp));
				const currentLevel = getLevel(xp);
				if (currentLevel > previousLevel) {
					const levelsUp = currentLevel - previousLevel;
					for (let i = 0; i < levelsUp; i++) {
						this.levelUpPlayer(player, currentLevel);
						previousLevel = currentLevel;
					}
				}
			});
		});
	}

	levelUpPlayer(player: Player, level: number) {
		const orderedPlayerData = new OrderedPlayerData(player);
		orderedPlayerData.cash.UpdateBy(100_000);
		orderedPlayerData.gems.UpdateBy(100);

		Events.levelUpPlayer(player, level);
	}
}
