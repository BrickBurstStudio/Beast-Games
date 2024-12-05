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
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";
import { countdown } from "server/util/countdown";
import { GreenClaimComponent } from "server/components/claim-components/green-claim.component";
import { Gizmo } from "server/classes/Gizmo";
import { Push } from "server/classes/gizmos/Push";

export class GoldRushChallenge extends BaseChallenge {
	protected readonly challengeName = "Gold Rush" as const;
	protected readonly rules = [
		"You must claim any gold platform to be safe.",
		"Each gold platform can only be claimed by one player.",
		"There are not enough gold platforms for everyone.",
	];
	protected readonly map = ServerStorage.ChallengeMaps.GoldRushChallenge.Clone();
	protected floor = false;
	private components = Dependency<Components>();
	private allGreenClaims: GreenClaimComponent[] = [];
	private greenClaims: GreenClaimComponent[] = [];
	private safePlayers: Player[] = [];
	private spawnOffset = 0;
	protected async main() {
		this.playersInChallenge.forEach((player) => {
			Gizmo.give(player, Push);
		});

		this.contestantDiedOrLeft.Event.Connect((player: Player) => {
			this.safePlayers = this.safePlayers.filter((p) => p !== player);
		});

		// Set up claim events

		while (!this.isFinished()) task.wait(0.25);
		this.playersInChallenge.forEach((player) => {
			if (!this.safePlayers.find((p) => p === player) && player.Character !== undefined) {
				// todo : add feat for displaying why plr died (ex. OUT OF TIME, NO MORE PLATFORMS, etc.)
				(player.Character as CharacterRigR6).Humanoid.Health = 0;
			}
		});
	}

	protected async isSetupCompleted() {
		return this.components.getAllComponents<GreenClaimComponent>().size() > 0;
	}

	protected async setup() {
		this.allGreenClaims = this.components.getAllComponents<GreenClaimComponent>();

		// Get the calculated number of claims we want
		const numClaimsNeeded = this.calculateGreenClaims();

		// Create a copy and shuffle the array
		const shuffledClaims = table.clone(this.allGreenClaims);
		for (let i = shuffledClaims.size() - 1; i > 0; i--) {
			const j = math.floor(math.random() * (i + 1));
			[shuffledClaims[i], shuffledClaims[j]] = [shuffledClaims[j], shuffledClaims[i]];
		}

		// Create new array with only the needed claims
		const selectedClaims: GreenClaimComponent[] = [];
		for (let i = 0; i < shuffledClaims.size(); i++) {
			if (i < numClaimsNeeded) {
				selectedClaims.push(shuffledClaims[i]);
			} else {
				shuffledClaims[i].instance.Destroy();
			}
		}

		this.greenClaims = selectedClaims;

		this.greenClaims.forEach((claim) => {
			this.obliterator.Add(
				claim.claimedEvent.Event.Connect((player: Player) => {
					this.safePlayers.push(player);
				}),
				"Disconnect",
			);
		});
	}

	private isFinished() {
		return (
			this.safePlayers.size() >= this.greenClaims.size() ||
			this.playersInChallenge.size() === 0 ||
			this.safePlayers.size() >= this.playersInChallenge.size()
		);
	}

	private calculateGreenClaims() {
		const playerCount = this.playersInChallenge.size();
		const greenClaims = math.clamp(math.ceil(playerCount / 3), 1, this.allGreenClaims.size());
		return greenClaims;
	}

	protected spawnCharacter({ character, i }: SpawnCharacterArgs): void {
		const children = this.map.Spawns.GetChildren() as BasePart[];
		character.PivotTo(children[i % children.size()].CFrame.ToWorldSpace(new CFrame(0, 0, this.spawnOffset)));

		if (i % children.size() === 0) {
			this.spawnOffset += 1.25;
		}
	}
}
