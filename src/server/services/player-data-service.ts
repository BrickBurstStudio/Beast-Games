/* eslint-disable roblox-ts/no-private-identifier */
import { OnInit, Service } from "@flamework/core";
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { Players, RunService } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";

import { store } from "server/store";
import { selectPlayerBalances, selectPlayerData } from "shared/store/selectors/players";
import { PlayerData } from "shared/store/slices/players/types";
import { defaultPlayerData } from "shared/store/slices/players/utils";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

let DataStoreName = "Production";
const KEY_TEMPLATE = "%d_Data";

if (RunService.IsStudio()) DataStoreName = "Testing";

@Service({})
export class PlayerDataService implements OnInit {
	private profileStore = ProfileService.GetProfileStore(DataStoreName, defaultPlayerData);
	private profiles = new Map<Player, Profile<PlayerData>>();

	onInit() {
		forEveryPlayer(
			(player) => this.createProfile(player),
			(player) => this.removeProfile(player),
		);

		// task.spawn(() => {
		//   while (true) {
		//     Players.GetPlayers().forEach((player) =>
		//       store.changeBalance(tostring(player.UserId), "coins", 1),
		//     );
		//     task.wait(1);
		//   }
		// });
	}

	private createProfile(player: Player) {
		const userId = player.UserId;
		const profileKey = KEY_TEMPLATE.format(userId);
		const profile = this.profileStore.LoadProfileAsync(profileKey);
		const orderedPlayerData = new OrderedPlayerData(player);

		if (!profile) return player.Kick();

		profile.ListenToRelease(() => {
			this.profiles.delete(player);
			store.closePlayerData(tostring(player.UserId));
			player.Kick();
		});

		profile.AddUserId(userId);
		profile.Reconcile();

		this.profiles.set(player, profile);
		store.loadPlayerData(tostring(player.UserId), {
			...profile.Data,
			balance: { ...profile.Data.balance, cash: orderedPlayerData.cash.Get() },
		});
		this.createLeaderstats(player);

		const unsubscribe = store.subscribe(selectPlayerData(tostring(player.UserId)), (save) => {
			if (save) profile.Data = save;
		});
		Players.PlayerRemoving.Connect((playerBeingRemoved) => {
			if (player === playerBeingRemoved) unsubscribe();
		});
	}

	private createLeaderstats(player: Player) {
		print("Creating leaderstats for", player.Name);
		const leaderstats = new Instance("Folder", player);
		leaderstats.Name = "leaderstats";

		const initialBalance = store.getState(selectPlayerBalances(tostring(player.UserId)));

		const cash = new Instance("NumberValue", leaderstats);
		cash.Name = "💰 Cash";
		cash.Value = initialBalance?.cash ?? 0;

		const gems = new Instance("NumberValue", leaderstats);
		gems.Name = "💎 Gems";
		gems.Value = initialBalance?.gems ?? 0;

		const honor = new Instance("NumberValue", leaderstats);
		honor.Name = "🏆 Honor";
		honor.Value = initialBalance?.honor ?? 0;

		const unsubscribe = store.subscribe(selectPlayerBalances(tostring(player.UserId)), (save) => {
			print("Updating leaderstats", save);
			if (!save) return;
			cash.Value = save.cash;
			gems.Value = save.gems;
			honor.Value = save.honor;
		});

		//TODO: refactor with better player removal handling / performance
		Players.PlayerRemoving.Connect((playerIn) => {
			if (playerIn === player) unsubscribe();
		});
	}

	private removeProfile(player: Player) {
		const profile = this.profiles.get(player);
		profile?.Release();
	}
}
