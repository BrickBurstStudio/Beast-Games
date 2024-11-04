import { OnStart, Service } from "@flamework/core";
import { ServerStorage } from "@rbxts/services";
import { store } from "server/store";
import { selectPlayerBalance, selectPlayerXP } from "shared/store/selectors/players";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { getLevel } from "shared/utils/functions/getLevel";

@Service()
export class TitleService implements OnStart {
	titleBGUI = ServerStorage.Assets.Gui.TitleBGUI;

	onStart() {
		// todo : get async func to work as forEveryPlayer callback
		forEveryPlayer((player) => {
			const titleBGUIClone = this.titleBGUI.Clone();

			const xpUnsub = store.subscribe(selectPlayerXP(tostring(player.UserId)), (xp) => {
				titleBGUIClone.Frame.Level.Text = !!xp ? tostring(getLevel(xp)) : "N/A";
			});

			getCharacter(player).then((character) => {
				if (!character) return;
				titleBGUIClone.Parent = character.Head;
			});

			titleBGUIClone.Username.Text = player.Name;
			titleBGUIClone.Frame.DisplayName.Text = player.DisplayName;

			return () => {
				xpUnsub();
			};
		});
	}
}
