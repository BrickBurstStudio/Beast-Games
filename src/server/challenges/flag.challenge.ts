import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import Object from "@rbxts/object-utils";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { Players, ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { ClaimComponent } from "../components/claim-components/claim.component";
import { FlagPoleComponent } from "../components/claim-components/flag-pole.component";
import { Events } from "server/network";
import { announce } from "server/util/announce";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { BaseChallenge } from "./base.challenge";
import { countdown } from "server/util/countdown";

export class FlagChallenge extends BaseChallenge {
	protected readonly challengeName = "Flag Run" as const;
	protected readonly rules = [
		"You will be playing against 1 random player.",
		"You must claim the flag and bring it back to your base to win!",
		"By the end of the round the player with the least amount of flags will be eliminated!",
		"If there is a tie, both players will be eliminated!",
	];
	protected readonly map = ServerStorage.ChallengeMaps.FlagChallenge.Clone();
	private readonly flagPoles: FlagPole[] = [];
	private readonly components = Dependency<Components>();
	private readonly FIELD_TIME = 30;

	private undecidedPlayers: Player[] = [];
	private playersInArena: Player[] = [];
	private playersToAdvanceTarget: number = 0;

	protected async main() {
		this.playersToAdvanceTarget = math.floor(this.playersInChallenge.size() * 0.8);
		this.undecidedPlayers = [...this.playersInChallenge];
		this.map.ChallengeArea.StartArea.Barier.Touched.Connect((otherPart) => {
			if (this.map.ChallengeArea.StartArea.Barier.CanCollide) return;
			const player = Players.GetPlayerFromCharacter(otherPart.Parent!);
			if (!player) return;
			if (!this.undecidedPlayers.includes(player)) return;
			this.undecidedPlayers.remove(this.undecidedPlayers.indexOf(player));
			this.playersInArena.push(player);
			Events.announcer.announce(player, ["You have entered the yellow area! Claim a flag or be eliminated!"]);
		});

		while (
			this.playersInChallenge.size() - this.undecidedPlayers.size() < this.playersToAdvanceTarget &&
			!this.IsSpaceAvailableForUndecidedPlayers()
		) {
			this.SpawnFlags();
			await announce(["Once you enter the yellow area, you must claim a flag or be eliminated!"]);
			this.map.ChallengeArea.StartArea.Barier.CanCollide = false;
			countdown({ seconds: this.FIELD_TIME, description: "SECONDS LEFT!" });
			this.YieldGameRound();
			Events.announcer.clearCountdown.broadcast();
			await this.MovePlayersWithClaimedFlagToEndArea();
			await this.RemovePlayersInArena();
			this.map.ChallengeArea.StartArea.Barier.CanCollide = true;
		}
		this.IsSpaceAvailableForUndecidedPlayers();
	}

	private IsSpaceAvailableForUndecidedPlayers() {
		if (this.playersToAdvanceTarget - this.playersInChallenge.size() >= 0) {
			this.undecidedPlayers.forEach((player) => this.MovePlayerToEndArea(player));
			announce(["There is space for everyone left to advance! Congratulations!"]);
			return true;
		}
		return false;
	}

	private async RemovePlayersInArena() {
		await Promise.all(
			this.playersInArena.map(async (player) => {
				this.undecidedPlayers.remove(this.undecidedPlayers.indexOf(player));
				this.playersInArena.remove(this.playersInArena.indexOf(player));
				this.playersInChallenge = this.playersInChallenge.filter((p) => p !== player);
			}),
		);
	}

	private async MovePlayerToEndArea(player: Player) {
		const character = await getCharacter(player);
		if (!character) return;
		const endPlatform = this.map.ChallengeArea.EndArea.PrimaryPart!;
		character.HumanoidRootPart.CFrame = endPlatform.CFrame.add(
			new Vector3(
				math.random(
					-endPlatform.Size.X / 2 + this.map.ChallengeArea.EndArea.Barier.Size.X,
					endPlatform.Size.X / 2,
				),
				endPlatform.Size.Y / 2 + 3,
				math.random(-endPlatform.Size.Z / 2, endPlatform.Size.Z / 2),
			),
		);
	}

	private async MovePlayersWithClaimedFlagToEndArea() {
		await Promise.all(
			Object.keys(ClaimComponent.playerClaims).map(async (playerId) => {
				const player = Players.GetPlayerByUserId(playerId);
				if (!player) error("Player not found, this should never happen. Please report this to a developer.");
				this.undecidedPlayers.remove(this.undecidedPlayers.indexOf(player));
				this.playersInArena.remove(this.playersInArena.indexOf(player));
				const claimed = ClaimComponent.playerClaims[playerId];
				if (!claimed) return;
				await this.MovePlayerToEndArea(player);
			}),
		);
	}

	private YieldGameRound() {
		// TODO: Refactor this to use `onAttributeChanged` instead of a while loop for performance reasons
		const startTime = DateTime.now().UnixTimestamp;
		while (this.flagPoles.size() > 0 && DateTime.now().UnixTimestamp - startTime < this.FIELD_TIME) {
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
			this.playersToAdvanceTarget - (this.playersInChallenge.size() - this.undecidedPlayers.size()),
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
		}
	}

	protected spawnCharacter({ player, character, i }: { player: Player; character: CharacterRigR6; i: number }) {
		// spawn player anywhere inside x and z bounds of `StartSide`
		character.HumanoidRootPart.CFrame = this.map.ChallengeArea.StartArea.Platform.CFrame.add(
			new Vector3(
				math.random(
					-this.map.ChallengeArea.StartArea.Platform.Size.X / 2,
					this.map.ChallengeArea.StartArea.Platform.Size.X / 2 -
						this.map.ChallengeArea.StartArea.Barier.Size.X,
				),
				this.map.ChallengeArea.StartArea.Platform.Size.Y / 2 + 3,
				math.random(
					-this.map.ChallengeArea.StartArea.Platform.Size.Z / 2 +
						this.map.ChallengeArea.Bariers.LeftBarier.Size.Z,
					this.map.ChallengeArea.StartArea.Platform.Size.Z / 2 -
						this.map.ChallengeArea.Bariers.RightBarier.Size.Z,
				),
			),
		);
	}
}
