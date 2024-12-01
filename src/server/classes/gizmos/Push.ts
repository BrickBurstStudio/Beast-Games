import { InputData } from "shared/network";
import { Gizmo } from "../Gizmo";
import { Players, ReplicatedStorage, ServerStorage, Workspace } from "@rbxts/services";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { CharacterRigR6 } from "@rbxts/promise-character";
import Make from "@rbxts/make";

export class Push extends Gizmo {
	name = "Push";
	tool = ServerStorage.Assets.Gizmos.Push.Clone();
	animationEvents: Record<string, () => void> = {};
	animations = {
		activated: ReplicatedStorage.Assets.Animations.PushActivated,
	};
	activationType = "server" as const;

	async activated() {
		const character = await getCharacter(this.owner);
		const origin = character.HumanoidRootPart.CFrame.ToWorldSpace(new CFrame(-2, 0, -2));
		const direction = origin.RightVector.mul(4);

		const params = new RaycastParams();
		params.FilterType = Enum.RaycastFilterType.Include;
		await Promise.all(
			Players.GetPlayers().map(async (player) => {
				if (player === this.owner) return;
				if (player.Character) params.AddToFilter(player.Character);
			}),
		);

		// Cast multiple rays with different Z offsets
		const zOffsets = [-1, 0, 1]; // Adjust these values as needed
		const hitCharacters = new Set<CharacterRigR6>();

		for (const zOffset of zOffsets) {
			const offsetOrigin = origin.add(new Vector3(0, 0, zOffset));
			const result = Workspace.Raycast(offsetOrigin.Position, direction, params);

			if (result) {
				const character = result.Instance.FindFirstAncestorWhichIsA("Model");
				if (character && character.FindFirstChildOfClass("Humanoid")) {
					hitCharacters.add(character as CharacterRigR6);
				}
			}
		}

		// Apply velocity to each unique character hit
		for (const character of hitCharacters) {
			const humanoid = character.FindFirstChildOfClass("Humanoid");
			if (!humanoid) continue;

			const velocity = Make("LinearVelocity", {
				Name: "PushVelocity",
				Attachment0: character.HumanoidRootPart.RootAttachment,
				RelativeTo: Enum.ActuatorRelativeTo.World,
				MaxForce: 15000 * character.HumanoidRootPart.AssemblyMass,
				VectorVelocity: (this.owner.Character as CharacterRigR6).HumanoidRootPart.CFrame.LookVector.mul(25),
				Parent: character.HumanoidRootPart,
			});

			task.wait(0.25);
			velocity.Destroy();
		}
	}
}
