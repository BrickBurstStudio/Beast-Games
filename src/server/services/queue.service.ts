import { OnStart, Service } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { Events } from "server/network";
import createForcefield from "shared/utils/functions/createForcefield";
import { getCharacter } from "shared/utils/functions/getCharacter";

@Service()
export class QueueService implements OnStart {
	onStart() {
		const queueBox = Workspace.WaitForChild("QueueBox") as Part;
		const forcefield = createForcefield(queueBox);

		// Handle exit queue requests
		Events.exitQueue.connect(async (player) => {
			if (!player.GetAttribute("inQueue")) return;
			
			const character = await getCharacter(player);
			// Move player outside the forcefield (offset in the forward direction)
			character.PivotTo(
				forcefield.CFrame.mul(new CFrame(0, -forcefield.Size.Y / 2, forcefield.Size.Z - 35)),
			);
			task.wait(0.2);
			player.SetAttribute("inQueue", false);
		});

		forcefield.GetChildren().forEach((child) => {
			if (!child.IsA("Part")) return;
			(child as Part).Touched.Connect(async (otherPart) => {
				const player = Players.GetPlayerFromCharacter(otherPart.Parent);
				if (!player) return;
				if (player.GetAttribute("inQueue")) return;

				const character = await getCharacter(player);
				character.PivotTo(forcefield.CFrame.mul(new CFrame(0, -forcefield.Size.Y / 2, 0)));
				player.SetAttribute("inQueue", true);
			});
		});
	}
}
