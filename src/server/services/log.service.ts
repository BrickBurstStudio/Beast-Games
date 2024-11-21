import { OnInit, Service } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";

@Service()
export class LogService implements OnInit {
	onInit() {
		Log.SetLogger(
			Logger.configure()
				.EnrichWithProperty("PlaceId", game.PlaceId)
				.WriteTo(Log.RobloxOutput()) // WriteTo takes a sink and writes to it
				.Create(), // Creates the logger from the configuration
		);
	}
}
