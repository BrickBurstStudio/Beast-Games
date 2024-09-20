import { Players, ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { BaseChallenge } from "./base-challenge";

import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import Object from "@rbxts/object-utils";
import { ClaimComponent } from "server/components/claim-components/claim-component";
import { FlagPoleComponent } from "server/components/claim-components/flag-pole-component";
import { Events } from "server/network";

const components = Dependency<Components>();

export class FlagChallenge extends BaseChallenge {
	protected announcements = ["Olivia", "Allison"];
	protected readonly map = ServerStorage.ChallengeMaps.FlagChallenge.Clone();

	private flagPoles: FlagPole[] = [];

	protected async Main() {
		let playerCount = Players.GetPlayers().size() + 1;
		const playerCountTarget = 1;
		while (playerCount > playerCountTarget) {
			print("Spawning flags");
			this.SpawnFlags();
			this.CountDown(10);
			this.WaitForAllSpawnedFlagsToBeClaimed();
			await this.MoveSafePlayersToSafeArea();
			playerCount = Players.GetPlayers().size();
		}
	}

	private CountDown(seconds: number) {
		Events.announcer.announce.broadcast(["Once you pass the red line, you must claim a flag or be eliminated!"]);
		task.wait(seconds);
	}

	private async MoveSafePlayersToSafeArea() {
		await Promise.all(
			Object.keys(ClaimComponent.playerClaims).map(async (playerId) => {
				const player = Players.GetPlayerByUserId(playerId);
				if (!player) error("Player not found");
				const claimed = ClaimComponent.playerClaims[playerId];
				if (!claimed) return;
				const character = await getCharacter(player);
				if (!character) return;

				character.HumanoidRootPart.CFrame = new CFrame(0, 20, 0);
			}),
		);
	}

	private WaitForAllSpawnedFlagsToBeClaimed() {
		// TODO: Refactor this to use `onAttributeChanged` instead of a while loop for performance reasons
		while (this.flagPoles.size() > 0) {
			for (const flag of this.flagPoles) {
				const flagComponent = components.getComponent<FlagPoleComponent>(flag);
				if (!flagComponent) continue;
				if (flagComponent.attributes.owner) {
					this.flagPoles.remove(this.flagPoles.indexOf(flag));
					flag.Destroy();
				}
			}
			task.wait();
		}
	}

	private SpawnFlags() {
		const flagsThisRound = math.random(1, math.ceil(Players.GetPlayers().size() / 2));
		for (let i = 0; i < flagsThisRound; i++) {
			const flagPole = ReplicatedStorage.Assets.Objects.FlagPole.Clone();
			this.flagPoles.push(flagPole);
			if (!flagPole.PrimaryPart) continue;
			flagPole.Parent = this.map;
			// flagPole.PrimaryPart.CFrame = new CFrame(50, 4, -30).mul(CFrame.Angles(0, math.rad(90), math.rad(90)));
			flagPole.PrimaryPart.CFrame = this.map.Baseplate.CFrame.add(
				new Vector3(
					math.random(
						-this.map.Baseplate.Size.X + this.map.Baseplate.Size.X / 2,
						this.map.Baseplate.Size.X - this.map.Baseplate.Size.X / 2,
					),
					this.map.Baseplate.Size.Y / 2 + flagPole.Pole.Size.X / 2,
					math.random(-this.map.Baseplate.Size.Z / 2, 60),
				),
			).mul(CFrame.Angles(0, math.rad(math.random(0, 180)), math.rad(90)));
			print("Flag spawned");
		}
	}

	protected SpawnPlayers(players: Player[]) {
		players.forEach(async (p) => {
			const character = await getCharacter(p);

			character.HumanoidRootPart.CFrame = this.map.Baseplate.CFrame.add(
				new Vector3(
					math.random(
						-this.map.Baseplate.Size.X + this.map.Baseplate.Size.X / 2,
						this.map.Baseplate.Size.X - this.map.Baseplate.Size.X / 2,
					),
					10,
					math.random(70, 90),
				),
			);
		});
	}
}
