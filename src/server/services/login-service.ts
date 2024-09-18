import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { store } from "server/store";
import { selectPlayerData, selectPlayerLoggedIns } from "shared/store/selectors/players";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

@Service()
export class LoginService implements OnStart {
	onStart() {
		forEveryPlayer((player) => {
			store.once(selectPlayerLoggedIns(tostring(player.UserId)), (playerLoggedIn) => {
				const today = os.date("!*t").yday;
				let rewarded = true;
				const orderedPlayerData = new OrderedPlayerData(player);
				if (!playerLoggedIn) return warn(`Player ${player.UserId} (${player.Name}) has no login data!`);

				if (!playerLoggedIn.last) {
					// first time logging in
					// give welcome rewards
					orderedPlayerData.xp.UpdateBy(75);
					orderedPlayerData.cash.UpdateBy(100_000);
					print(`Player ${player.UserId} (${player.Name}) has logged in for the first time!`);
				} else if (playerLoggedIn.last !== today) {
					// player has logged in on a new day
					// give daily rewards
					orderedPlayerData.xp.UpdateBy(50);
					orderedPlayerData.cash.UpdateBy(50_000);
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
					orderedPlayerData.xp.UpdateBy(1);
				}
			});
		});
	}
}
