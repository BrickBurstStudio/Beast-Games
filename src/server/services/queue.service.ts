import { OnStart } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import createForcefield from "shared/utils/functions/createForcefield";


export class QueueService implements OnStart {
	onStart() {
		const queueBox = Workspace.WaitForChild("QueueBox") as Part;
		createForcefield(queueBox);
	}
}

