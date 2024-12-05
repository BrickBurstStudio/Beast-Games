import React, { useEffect } from "@rbxts/react";
import { TextChatService } from "@rbxts/services";
import { Events } from "client/network";
import AnnouncerApp from "./announcer";
import CountdownApp from "./countdown";
import AnnounceRules from "./rules";

export default function AnnounceApp() {
	useEffect(() => {
		const connection = Events.announcer.chatMessage.connect((message) => {
			(
				TextChatService as unknown as { TextChannels: Record<string, TextChannel> }
			).TextChannels.RBXGeneral.DisplaySystemMessage(message);
		});

		return () => connection.Disconnect();
	}, []);

	return (
		<>
			<AnnouncerApp />
			<AnnounceRules />
			<CountdownApp />
		</>
	);
}
