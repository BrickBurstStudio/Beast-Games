import React, { useEffect, useRef, useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

function useAnnouncement() {
	const [message, setMessage] = useState<string | undefined>();
	const lastMessage = useRef("_!_");

	useEffect(() => {
		const conn = Events.announcer.announce.connect((announcement) => {
			setMessage(announcement.message);
			lastMessage.current = announcement.message;
			task.wait(5);
			if (lastMessage.current === announcement.message) setMessage(undefined);
		});

		return () => conn.Disconnect();
	}, []);

	return message;
}

export default function AnnouncerApp() {
	const message = useAnnouncement();

	return (
		<motion.frame
			BackgroundTransparency={1}
			Size={UDim2.fromOffset(px(1000), px(200))}
			Position={UDim2.fromScale(0.5, 0.8)}
			AnchorPoint={new Vector2(0.5, 1)}
		>
			<textlabel
				Size={UDim2.fromScale(1, 1)}
				Text={message ?? ""}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={30}
				Font={"Jura"}
				BackgroundTransparency={1}
				TextWrapped
			></textlabel>
		</motion.frame>
	);
}
