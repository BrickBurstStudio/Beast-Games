import { OnStart, Service } from "@flamework/core";
import { AnalyticsService, ServerStorage } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Events } from "server/network";
import { store } from "server/store";
import { selectPlayerData, selectPlayerXP } from "shared/store/selectors/players";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { getLevel } from "shared/utils/functions/getLevel";

@Service()
export class LevelService implements OnStart {
	private readonly levelUpReward = 50_000;
	onStart() {
		forEveryPlayer((player) => {
			let previousLevel: number | undefined = undefined;

			return store.subscribe(selectPlayerXP(tostring(player.UserId)), (xp) => {
				if (!xp) return;
				if (previousLevel === undefined) return (previousLevel = getLevel(xp));
				const currentLevel = getLevel(xp);
				if (currentLevel > previousLevel) {
					const levelsUp = currentLevel - previousLevel;
					for (let i = 0; i < levelsUp; i++) {
						task.spawn(() => this.levelUpPlayer(player, currentLevel));
						previousLevel = currentLevel;
					}
				}
			});
		});
	}

	async levelUpPlayer(player: Player, level: number) {
		const orderedPlayerData = new OrderedPlayerData(player);
		orderedPlayerData.cash.UpdateBy(this.levelUpReward);
		AnalyticsService.LogCustomEvent(player, "leveled_up", level);
		const playerData = store.getState(selectPlayerData(tostring(player.UserId)));
		AnalyticsService.LogEconomyEvent(
			player,
			Enum.AnalyticsEconomyFlowType.Source,
			"cash",
			this.levelUpReward,
			playerData.balance.cash,
			Enum.AnalyticsEconomyTransactionType.Gameplay.Name,
		);

		Events.animations.levelUp(player, level);

		const levelUpVFX = ServerStorage.Assets.VFX.LevelUp.Clone();
		const character = await getCharacter(player);
		levelUpVFX.Parent = character;
		levelUpVFX.Weld.Part1 = character.Torso;

		levelUpVFX.Sound.Play();
		(levelUpVFX.Start.GetChildren() as ParticleEmitter[]).forEach((v) => (v.Enabled = true));

		const vfxDuration = 0.5;
		task.wait(vfxDuration);
		(levelUpVFX.Start.GetChildren() as ParticleEmitter[]).forEach((v) => (v.Enabled = false));
		task.wait(levelUpVFX.Sound.TimeLength - vfxDuration);

		levelUpVFX.Destroy();
	}
}
