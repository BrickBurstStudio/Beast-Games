/* eslint-disable roblox-ts/no-private-identifier */
import { OnInit, Service } from "@flamework/core";
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { HttpService, Players, RunService } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";

import { store } from "server/store";
import { selectPlayerBalances, selectPlayerData } from "shared/store/selectors/players";
import { PlayerData, PlayerQuests, ProfileData, QuestData } from "shared/store/slices/players/types";
import { defaultPlayerData, defaultProfileData } from "shared/store/slices/players/utils";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

const KEY_TEMPLATE = "%d_Data";

let DataStoreName = "Production";
if (RunService.IsStudio()) DataStoreName = "Testing";

@Service({})
export class PlayerDataService implements OnInit {
	private profileStore = ProfileService.GetProfileStore(DataStoreName, defaultProfileData);
	private profiles = new Map<Player, Profile<ProfileData>>();

	onInit() {
		forEveryPlayer(
			(player) => this.createProfile(player),
			(player) => this.removeProfile(player),
		);
	}

	private createProfile(player: Player) {
		const userId = player.UserId;
		const profileKey = KEY_TEMPLATE.format(userId);
		const profile = this.profileStore.LoadProfileAsync(profileKey);
		const orderedPlayerData = new OrderedPlayerData(player);
		if (!profile) return player.Kick();
		player.SetAttribute("eliminated", false)
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
			balance: {
				...profile.Data.balance,
				cash: orderedPlayerData.cash.Get(),
				gems: orderedPlayerData.gems.Get(),
				honor: orderedPlayerData.honor.Get(),
			},
			quests: HttpService.JSONDecode(profile.Data.quests) as PlayerQuests,
		});
		this.createLeaderstats(player);

		const unsubscribe = store.subscribe(selectPlayerData(tostring(player.UserId)), (save) => {
			if (save) {
				const jsonQuests = HttpService.JSONEncode(save.quests);
				profile.Data = { ...save, quests: jsonQuests };
			}
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

		return store.subscribe(selectPlayerBalances(tostring(player.UserId)), (save) => {
			print("Updating leaderstats", save);
			if (!save) return;
			cash.Value = save.cash;
			gems.Value = save.gems;
			honor.Value = save.honor;
		});
	}

	private removeProfile(player: Player) {
		const profile = this.profiles.get(player);
		profile?.Release();
	}
}
