import { CollectionService, Players, ServerStorage, Workspace } from "@rbxts/services";
import { Gizmo } from "../Gizmo";
import { Events, Functions } from "server/network";
import { GlobalFunctions, InputData } from "shared/network";
import { isCharacterPart } from "shared/utils/functions/isCharacterPart";

export class Tower extends Gizmo {
	animationEvents: Record<string, () => void> = {};
	animations = {};
	name = "Tower";
	tool = ServerStorage.Assets.Gizmos.Tower.Clone();
	activationType = "client" as const;
	parentValidation: Instance | undefined;

	async activated(inputData: InputData | undefined) {
		if (!inputData) return;
		const params = new RaycastParams();
		params.FilterType = Enum.RaycastFilterType.Exclude;
		params.FilterDescendantsInstances = CollectionService.GetTagged("ignore");
		const results = Workspace.Raycast(inputData.origin, inputData.direction.mul(500), params);
		if (
			results === undefined ||
			results.Instance === undefined ||
			results.Instance.Parent !== this.parentValidation ||
			results.Normal.Y < 0.8
		)
			return;
		this.placeTower(results);
		this.destroy();
	}

	private placeTower(results: RaycastResult) {
		const blockTower = ServerStorage.Assets.Objects.BlockTower.Clone();
		const dropTower = (conn: RBXScriptConnection) => {
			conn.Disconnect();
			blockTower.GetChildren().forEach((c) => {
				if (c.Name === "Block" && c.IsA("BasePart")) {
					c.Anchored = false;
					c.SetNetworkOwner(this.owner);
					c.AssemblyLinearVelocity = new Vector3(math.random() * 60 - 30, 0, math.random() * 60 - 30);
					c.AssemblyAngularVelocity = new Vector3(
						math.random() * 20 - 10,
						math.random() * 20 - 10,
						math.random() * 20 - 10,
					);
					blockTower.SetAttribute("dropped", true);
				}
			});
		};

		const conn = blockTower.Hitbox.Touched.Connect((hit) => {
			if (!blockTower.GetAttribute("touchEnabled")) return;

			if (isCharacterPart(hit)) {
				const player = Players.GetPlayerFromCharacter(hit.Parent);
				if (player === undefined || player !== this.owner) return;
				dropTower(conn);
			} else if (hit.Name.lower() === "ball") {
				dropTower(conn);
			}
		});

		blockTower.SetAttribute("owner", this.owner.UserId);
		blockTower.SetAttribute("dropped", false);

		blockTower.PivotTo(new CFrame(results.Position.add(new Vector3(0, blockTower.Hitbox.Size.Y / 2, 0))));
		blockTower.Parent = Workspace;
	}

	setParentValidation(instance: Instance) {
		this.parentValidation = instance;
	}
}
