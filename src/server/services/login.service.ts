import { OnStart, Service } from "@flamework/core";
import { AnalyticsService, Players } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { store } from "server/store";
import { selectPlayerData, selectPlayerLoggedIns } from "shared/store/selectors/players";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

@Service()
export class LoginService implements OnStart {
	private readonly welcomeReward = 100_000;
	private readonly dailyReward = 20_000;
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
					orderedPlayerData.cash.UpdateBy(this.welcomeReward);
					const playerData = store.getState(selectPlayerData(tostring(player.UserId)));
					AnalyticsService.LogEconomyEvent(
						player,
						Enum.AnalyticsEconomyFlowType.Source,
						"cash",
						this.welcomeReward,
						playerData.balance.cash,
						Enum.AnalyticsEconomyTransactionType.Onboarding.Name,
					);
				} else if (playerLoggedIn.last !== today) {
					// player has logged in on a new day
					// give daily rewards
					orderedPlayerData.xp.UpdateBy(50);
					orderedPlayerData.cash.UpdateBy(this.dailyReward);
					const playerData = store.getState(selectPlayerData(tostring(player.UserId)));
					AnalyticsService.LogEconomyEvent(
						player,
						Enum.AnalyticsEconomyFlowType.Source,
						"cash",
						this.dailyReward,
						playerData.balance.cash,
						Enum.AnalyticsEconomyTransactionType.TimedReward.Name,
					);
				} else {
					// player has already logged in today. cringe. get a job
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
