import { OnInit, Controller } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";

@Controller()
export class LogService implements OnInit {
	onInit() {
		Log.SetLogger(
			Logger.configure()
				.WriteTo(Log.RobloxOutput()) // WriteTo takes a sink and writes to it
				.Create(), // Creates the logger from the configuration
		);
	}
}
