import Object from "@rbxts/object-utils";
import React, { useEffect, useRef, useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import RegExp from "@rbxts/regexp";
import { ReplicatedStorage } from "@rbxts/services";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";
import { ANNOUNCER_CONFIGS, RICH_TEXT_REPLACE } from "shared/configs/announcer";

function typeString(str: string, richTextReplace: { [key: string]: string }, update: (str: string) => void) {
	const richTextReplaceCopy = { ...richTextReplace, ...RICH_TEXT_REPLACE };

	let s = "";
	for (let i = 0; i <= str.size(); i++) {
		s = str.sub(0, i);
		for (const [key, value] of Object.entries(richTextReplaceCopy)) {
			const result = s.gsub(key, value)[0];
			s = result.size() > 0 ? result.gsub("replace", key)[0] : s;
		}
		update(s);
		ReplicatedStorage.Assets.Sounds.Character.Play();
		task.wait(ANNOUNCER_CONFIGS.keystrokeTime);
	}
}

function useAnnouncement() {
	const [message, setMessage] = useState("");
	const [hide, setHide] = useState(true);
	const messageQueue = useRef<[string, { [key: string]: string }][]>([]);

	useEffect(() => {
		const conn = Events.announcer.announce.connect((announcements, richTextReplace) => {
			announcements.forEach((a) => messageQueue.current.push([a, richTextReplace ?? {}]));
		});

		task.spawn(() => {
			while (true) {
				task.wait();
				if (messageQueue.current.size() < 1) continue;
				const msg = messageQueue.current.remove(0)!;

				setHide(false);
				task.wait(ANNOUNCER_CONFIGS.preMessageTime);
				typeString(msg[0], msg[1], setMessage);
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
			BackgroundTransparency={0}
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
				Text={`<b>${message}</b>`}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={30}
				Font={"Jura"}
				BackgroundTransparency={1}
				TextWrapped
				RichText={true}
			></textlabel>
		</motion.frame>
	);
}
