import React, { useEffect, useRef, useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";
import { ANNOUNCER_CONFIGS } from "shared/configs/announcer";

function typeString(str: string, update: (str: string) => void) {
	for (let i = 0; i <= str.size(); i++) {
		update(str.sub(0, i));
		task.wait(ANNOUNCER_CONFIGS.keystrokeTime);
	}
}

function useAnnouncement() {
	const [message, setMessage] = useState("");
	const [hide, setHide] = useState(true);
	const messageQueue = useRef<string[]>([]);

	useEffect(() => {
		const conn = Events.announcer.announce.connect((announcements) => {
			announcements.forEach((a) => messageQueue.current.push(a));
		});

		task.spawn(() => {
			while (true) {
				task.wait();
				if (messageQueue.current.size() < 1) continue;
				const msg = messageQueue.current.remove(0)!;

				setHide(false);
				task.wait(ANNOUNCER_CONFIGS.preMessageTime);
				typeString(msg, setMessage);
				task.wait(ANNOUNCER_CONFIGS.postMessageTime);

				if (messageQueue.current.size() < 1) {
					setHide(true);
					task.wait(ANNOUNCER_CONFIGS.animationTime);
					setMessage("");
				}
			}
		});

		return () => conn.Disconnect();
	}, []);

	return [message, hide];
}

export default function AnnouncerApp() {
	const [message, hide] = useAnnouncement();

	return (
		<motion.frame
			animate={{ Position: hide ? UDim2.fromScale(0.5, 1.5) : UDim2.fromScale(0.5, 0.8) }}
			BackgroundTransparency={0.8}
			Size={UDim2.fromOffset(px(700), px(200))}
			Position={UDim2.fromScale(0.5, 1.5)}
			AnchorPoint={new Vector2(0.5, 1)}
			transition={{
				duration: 0.5,
				easingStyle: Enum.EasingStyle.Cubic,
				easingDirection: Enum.EasingDirection.InOut,
			}}
		>
			<uicorner CornerRadius={new UDim(0.25, 0)} />
			<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={px(4)} Transparency={0.5} />
			<textlabel
				Size={UDim2.fromScale(1, 1)}
				Text={`<b>${message as string}</b>`}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={30}
				Font={"Jura"}
				BackgroundTransparency={1}
				TextWrapped
				RichText
			></textlabel>
		</motion.frame>
	);
}
