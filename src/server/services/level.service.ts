import { OnStart, Service } from "@flamework/core";
import { ServerStorage } from "@rbxts/services";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Events } from "server/network";
import { store } from "server/store";
import { selectPlayerXP } from "shared/store/selectors/players";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { getLevel } from "shared/utils/functions/getLevel";

@Service()
export class LevelService implements OnStart {
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
		const vfxDuration = 0.5;

		const orderedPlayerData = new OrderedPlayerData(player);
		orderedPlayerData.cash.UpdateBy(100_000);

		Events.animations.levelUp(player, level);

		const levelUpVFX = ServerStorage.Assets.VFX.LevelUp.Clone();
		const character = await getCharacter(player);
		levelUpVFX.Parent = character;
		levelUpVFX.Weld.Part1 = character.Torso;

		levelUpVFX.Sound.Play();
		(levelUpVFX.Start.GetChildren() as ParticleEmitter[]).forEach((v) => (v.Enabled = true));
		task.wait(vfxDuration);
		(levelUpVFX.Start.GetChildren() as ParticleEmitter[]).forEach((v) => (v.Enabled = false));
		task.wait(levelUpVFX.Sound.TimeLength - vfxDuration);

		levelUpVFX.Destroy();
	}
}
