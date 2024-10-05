import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import Object from "@rbxts/object-utils";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { Players, ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { ClaimComponent } from "server/components/claim-components/claim.component";
import { FlagPoleComponent } from "server/components/claim-components/flag-pole.component";
import { Events } from "server/network";
import { announceAndWait } from "server/util/announceAndWait";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { BaseChallenge } from "./base.challenge";

export class FlagChallenge extends BaseChallenge {
	protected readonly map = ServerStorage.ChallengeMaps.FlagChallenge.Clone();
	private readonly flagPoles: FlagPole[] = [];
	private readonly components = Dependency<Components>();

	private playingPlayers: Player[] = [];
	private readonly playerAmountTarget = 1;

	protected async Main() {
		this.playingPlayers = [...this.players];

		while (this.playingPlayers.size() > this.playerAmountTarget) {
			print("Spawning flags");
			this.SpawnFlags();
			announceAndWait(["Once you pass the red line, you must claim a flag or be eliminated!"]);
			Events.announcer.countdown.broadcast({
				description: "Claim a flag or be eliminated!",
				seconds: 5,
			});
			task.wait(5);
			this.WaitForAllSpawnedFlagsToBeClaimed();
			await this.MoveSafePlayersToSafeArea();
		}
	}

	private async MoveSafePlayersToSafeArea() {
		await Promise.all(
			Object.keys(ClaimComponent.playerClaims).map(async (playerId) => {
				const player = Players.GetPlayerByUserId(playerId);
				if (!player) error("Player not found");
				this.playingPlayers.remove(this.playingPlayers.indexOf(player));
				const claimed = ClaimComponent.playerClaims[playerId];
				if (!claimed) return;
				const character = await getCharacter(player);
				if (!character) return;

				const endPlatform = this.map.ChallengeArea.EndArea.PrimaryPart!;
				character.HumanoidRootPart.CFrame = endPlatform.CFrame.add(
					new Vector3(
						math.random(-endPlatform.Size.X / 2, endPlatform.Size.X / 2) +
							this.map.ChallengeArea.EndArea.Barier.Size.X,
						endPlatform.Size.Y / 2 + 3,
						math.random(-endPlatform.Size.Z / 2, endPlatform.Size.Z / 2),
					),
				);
			}),
		);
	}

	private WaitForAllSpawnedFlagsToBeClaimed() {
		// TODO: Refactor this to use `onAttributeChanged` instead of a while loop for performance reasons
		while (this.flagPoles.size() > 0) {
			for (const flag of this.flagPoles) {
				const flagComponent = this.components.getComponent<FlagPoleComponent>(flag);
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
		const flagsThisRound = math.min(
			math.random(1, math.floor(Players.GetPlayers().size() / 2)),
			this.playingPlayers.size() - this.playerAmountTarget,
		);
		
		for (let i = 0; i < flagsThisRound; i++) {
			const flagPole = ReplicatedStorage.Assets.Objects.FlagPole.Clone();
			this.flagPoles.push(flagPole);
			if (!flagPole.PrimaryPart) continue;
			flagPole.Parent = this.map;
			flagPole.PrimaryPart.CFrame = this.map.ChallengeArea.PlayArea.CFrame.add(
				new Vector3(
					math.random(
						-this.map.ChallengeArea.PlayArea.Size.X / 2,
						this.map.ChallengeArea.PlayArea.Size.X / 2,
					),

					this.map.ChallengeArea.PlayArea.Size.Y / 2 + flagPole.Pole.Size.X / 2,

					math.random(
						-this.map.ChallengeArea.PlayArea.Size.Z / 2,
						this.map.ChallengeArea.PlayArea.Size.Z / 2,
					),
				),
			).mul(CFrame.Angles(0, math.rad(math.random(0, 180)), math.rad(90)));

			print("Flag spawned");
		}
	}

	protected SpawnCharacter({ player, character, i }: { player: Player; character: CharacterRigR6; i: number }) {
		// spawn player anywhere inside x and z bounds of `StartSide`
		character.HumanoidRootPart.CFrame = this.map.ChallengeArea.StartArea.CFrame.add(
			new Vector3(
				math.random(-this.map.ChallengeArea.StartArea.Size.X / 2, this.map.ChallengeArea.StartArea.Size.X / 2),
				this.map.ChallengeArea.StartArea.Size.Y / 2 + 3,
				math.random(-this.map.ChallengeArea.StartArea.Size.Z / 2, this.map.ChallengeArea.StartArea.Size.Z / 2),
			),
		);
	}
}
