import Object from "@rbxts/object-utils";
import React, { useEffect, useRef, useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { px, usePx } from "client/ui/utils/usePx";

function typeString(str: string, direction: "->" | "<-", update: (str: string) => void) {
	for (
		let i = direction === "->" ? 0 : str.size();
		direction === "->" ? i <= str.size() : i >= 0;
		direction === "->" ? i++ : i--
	) {
		update(str.sub(0, i));
		task.wait(direction === "->" ? 0.03 : 0.01);
	}
}

function useAnnouncement() {
	const [message, setMessage] = useState("");
	const [hideState, setHideState] = useState(true);
	const hideRef = useRef(true);
	const messageQueue = useRef<string[]>([]);

	const setHide = (bool: boolean) => {
		setHideState(bool);
		hideRef.current = bool;
	};

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
				task.wait(0.5);
				typeString(msg, "->", setMessage);
				task.wait(2);

				if (messageQueue.current.size() < 1) {
					setHide(true);
					task.wait(0.5);
					setMessage("");
				}
			}
		});

		return () => conn.Disconnect();
	}, []);

	return [message, hideState];
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
