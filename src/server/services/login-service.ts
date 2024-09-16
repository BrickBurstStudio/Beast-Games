import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { store } from "server/store";
import { selectPlayerLoggedIns } from "shared/store/selectors/players";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getPlayerMultiplier } from "shared/utils/functions/getPlayerMultiplier";

@Service()
export class LoginService implements OnStart {
	onStart() {
		forEveryPlayer((player) => {
			task.wait(2);
			const today = os.date("!*t").yday;
			let rewarded = true;
			const playerLoggedIn = store.getState(selectPlayerLoggedIns(tostring(player.UserId)));
			const orderedPlayerData = new OrderedPlayerData(player);
			if (!playerLoggedIn) return warn(`Player ${player.UserId} (${player.Name}) has no login data!`);

			if (!playerLoggedIn.last) {
				// first time logging in
				// give welcome rewards
				orderedPlayerData.xp.UpdateBy(75 * getPlayerMultiplier(player));
				orderedPlayerData.cash.UpdateBy(100_000 * getPlayerMultiplier(player));
				print(`Player ${player.UserId} (${player.Name}) has logged in for the first time!`);
			} else if (playerLoggedIn.last !== today) {
				// player has logged in on a new day
				// give daily rewards
				orderedPlayerData.xp.UpdateBy(50 * getPlayerMultiplier(player));
				orderedPlayerData.cash.UpdateBy(50_000 * getPlayerMultiplier(player));
				print(`Player ${player.UserId} (${player.Name}) has logged in today!`);
			} else {
				// player has already logged in today. cringe. get a job
				print(`Player ${player.UserId} (${player.Name}) has already logged in today!`);
				rewarded = false;
			}

			store.logIn(tostring(player.UserId));

			while (true) {
				task.wait(60);
				if (!Players.GetPlayers().find((p: Player) => p === player)) break;
				orderedPlayerData.playTime.UpdateBy(1);
				orderedPlayerData.xp.UpdateBy(1 * getPlayerMultiplier(player));
			}
		});
	}
}
