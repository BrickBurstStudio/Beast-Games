import { OnStart, Service } from "@flamework/core";
import { Events } from "server/network";
import { selectPlayerBalance, selectPlayerXP } from "shared/store/selectors/players";
import { store } from "server/store";
import { getLevel } from "shared/utils/functions/getLevel";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { FormatStandard } from "@rbxts/format-number";

@Service()
export class MoneyService implements OnStart {
	onStart() {
		forEveryPlayer((player) => {
			let previousBalance: number | undefined = undefined;

			return store.subscribe(selectPlayerBalance(tostring(player.UserId), "cash"), (balance) => {
				if (!balance) return;
				if (previousBalance === undefined) return (previousBalance = balance);
				if (balance <= previousBalance) return;
				this.moneyIncreasedVFX(player, balance - previousBalance);
				previousBalance = balance;
			});
		});
	}

	async moneyIncreasedVFX(player: Player, amount: number) {
		if (!player.Character) return;

		const vfx = ServerStorage.Assets.VFX.MoneyVFX.Clone();
		const sfx = ServerStorage.Assets.Sounds.MoneySFX.Clone();
		const bgui = ReplicatedStorage.Assets.Gui.MoneyBGUI.Clone();
		const character = await getCharacter(player);

		bgui.TextLabel.Text = `+ $${FormatStandard(amount)}`;

		bgui.Parent = character.Head;
		bgui.Adornee = character.Head;
		vfx.Parent = character.HumanoidRootPart;
		sfx.Parent = character.HumanoidRootPart;
		sfx.Play();
		vfx.Enabled = true;

		task.wait(1.5);

		vfx.Enabled = false;
		bgui.Destroy();
		sfx.Destroy();

		task.wait(1);
		vfx.Destroy();
	}
}
