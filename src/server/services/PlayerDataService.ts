/* eslint-disable roblox-ts/no-private-identifier */
import { OnInit, Service } from "@flamework/core";
import { subscribe } from "@rbxts/charm";
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { Players, RunService } from "@rbxts/services";
import { $print } from "rbxts-transform-debug";
import { PlayerData } from "server/PlayerData";
import { defaultPlayerData, loadPlayer, rootAtom, TPlayerData, unloadPlayer } from "shared/atoms/player";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

let DataStoreName = "Production";
const KEY_TEMPLATE = "%d_Data";

if (RunService.IsStudio()) DataStoreName = "Testing";

@Service({})
export class PlayerDataService implements OnInit {
	private profileStore = ProfileService.GetProfileStore(DataStoreName, defaultPlayerData);
	private profiles = new Map<Player, Profile<TPlayerData>>();

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

		if (!profile) return player.Kick();

		profile.ListenToRelease(() => {
			this.profiles.delete(player);
			unloadPlayer(player.UserId);
			player.Kick();
		});

		profile.AddUserId(userId);
		profile.Reconcile();

		this.profiles.set(player, profile);
		loadPlayer(player.UserId, profile.Data);
		this.createLeaderstats(player);

		const unsubscribe = subscribe(
			() => rootAtom().get(player.UserId),
			(save) => {
				if (save) profile.Data = save;
			},
		);
		Players.PlayerRemoving.Connect((playerBeingRemoved) => {
			if (player === playerBeingRemoved) unsubscribe();
		});
	}

	private createLeaderstats(player: Player) {
		// $print("Creating leaderstats for", player.Name);
		// const leaderstats = new Instance("Folder", player);
		// leaderstats.Name = "leaderstats";
		// const initialBalance = store.getState(selectPlayerBalances(tostring(player.UserId)));
		// const coins = new Instance("NumberValue", leaderstats);
		// coins.Name = "💰 Coins";
		// coins.Value = initialBalance?.coins ?? 0;
		// const gems = new Instance("NumberValue", leaderstats);
		// gems.Name = "💎 Gems";
		// gems.Value = initialBalance?.gems ?? 0;
		// const unsubscribe = store.subscribe(selectPlayerBalances(tostring(player.UserId)), (save) => {
		// 	$print("Updating leaderstats", save);
		// 	if (!save) return;
		// 	coins.Value = save.coins ?? 0;
		// 	gems.Value = save.gems ?? 0;
		// });
		// //TODO: refactor with better player removal handling / performance
		// Players.PlayerRemoving.Connect((playerIn) => {
		// 	if (playerIn === player) unsubscribe();
		// });
	}

	private removeProfile(player: Player) {
		const profile = this.profiles.get(player);
		profile?.Release();
	}

	//TODO: add better profile handling when getting profile
	public getProfileSync(player: Player) {
		let profile = this.profiles.get(player);
		while (!profile) {
			profile = this.profiles.get(player);
			task.wait(0.25);
		}

		return profile!;
	}
}
