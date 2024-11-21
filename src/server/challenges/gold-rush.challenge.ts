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

export class GoldRushChallenge extends BaseChallenge {
	protected readonly challengeName = "Flag";
	protected readonly rules = [
		"You must touch a green platform to be safe.",
		"There are not enough green platforms for everyone.",
	];
	protected readonly map = ServerStorage.ChallengeMaps.GoldRushChallenge.Clone();

	protected async Main() {}

	protected SetupCharacter({ character, i }: SpawnCharacterArgs): void {
		const children = this.map.Spawns.GetChildren() as BasePart[];
		character.PivotTo(children[i % children.size()].CFrame);
	}
}
