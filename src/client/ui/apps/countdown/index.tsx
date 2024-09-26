import React, { useEffect, useRef, useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

function useCountdown() {
	const [description, setDescription] = useState("");
	const [seconds, setSeconds] = useState<number>(0);
	const [hide, setHide] = useState(true);
	const initialSeconds = useRef<number>(0);

	useEffect(() => {
		const conn = Events.announcer.countdown.connect(({ seconds, description }) => {
			initialSeconds.current = seconds;
			setDescription(description);
			setHide(false);
			for (let i = seconds; i >= 0; i--) {
				setSeconds(i);
				task.wait(1);
			}
			setHide(true);
			task.wait(0.5);
			setDescription("");
		});

		return () => conn.Disconnect();
	}, []);

	return { initialSeconds, seconds, description, hide };
}

export default function CountdownApp() {
	let { initialSeconds, seconds, description, hide } = useCountdown();

	return (
		<motion.frame
			animate={{ Position: hide ? UDim2.fromScale(0.5, 0) : new UDim2(0.5, 0, 0, px(250)) }}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0)}
			AnchorPoint={new Vector2(0.5, 1)}
			transition={{
				duration: 0.5,
				easingStyle: Enum.EasingStyle.Cubic,
				easingDirection: Enum.EasingDirection.InOut,
			}}
			AutomaticSize={"XY"}
		>
			<uilistlayout HorizontalAlignment={"Center"} />
			<motion.textlabel
				animate={{
					TextColor3: Color3.fromRGB(
						255,
						seconds ? (seconds / initialSeconds.current) * 255 : 255,
						seconds ? (seconds / initialSeconds.current) * 255 : 255,
					),
				}}
				Size={UDim2.fromOffset(px(125), px(125))}
				Text={`<b>${seconds}</b>`}
				Font={"Jura"}
				BackgroundTransparency={1}
				TextWrapped
				TextScaled
				RichText
			/>
			<textlabel
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(px(500), px(100))}
				Text={description}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled
			/>
		</motion.frame>
	);
}
