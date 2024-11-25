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

export class GoldRushChallenge extends BaseChallenge {
	protected readonly challengeName = "Gold Rush";
	protected readonly rules = [
		"You must touch a green platform to be safe.",
		"There are not enough green platforms for everyone.",
		"There will be 3 rounds.",
	];
	protected readonly map = ServerStorage.ChallengeMaps.GoldRushChallenge.Clone();
	protected floor = false;
	private components = Dependency<Components>();
	private allGreenClaims: GreenClaimComponent[] = [];
	private greenClaims: GreenClaimComponent[] = [];
	private safePlayers: Player[] = [];
	protected async Main() {
		this.allGreenClaims = this.components.getAllComponents<GreenClaimComponent>();
		this.setupClaims();
		this.contestantDiedOrLeft.Event.Connect((player: Player) => {
			this.safePlayers = this.safePlayers.filter((p) => p !== player);
		});

		// Set up claim events

		task.wait(5000);
		// while (!this.isFinished()) task.wait();
	}

	private isFinished() {
		if (this.greenClaims === undefined) return warn("Green claims are undefined");

		return this.safePlayers.size() >= this.greenClaims.size() || this.playersInChallenge.size() === 0;
	}

	private setupClaims() {
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
			claim.claimedEvent.Event.Connect((player: Player) => {
				this.safePlayers.push(player);
			});
		});
	}

	private calculateGreenClaims() {
		const playerCount = this.playersInChallenge.size();
		const greenClaims = math.clamp(math.ceil(playerCount / 3), 1, this.allGreenClaims.size());
		return greenClaims;
	}

	protected SetupCharacter({ character, i }: SpawnCharacterArgs): void {
		const children = this.map.Spawns.GetChildren() as BasePart[];
		character.PivotTo(children[i % children.size()].CFrame);
	}
}
