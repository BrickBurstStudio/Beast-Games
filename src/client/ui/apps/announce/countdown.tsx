import React, { useEffect, useRef, useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { ReplicatedStorage } from "@rbxts/services";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

function useCountdown() {
	const [description, setDescription] = useState("");
	const [seconds, setSeconds] = useState<number>(math.huge);
	const [hide, setHide] = useState(true);
	const [showGo, setShowGo] = useState(false);
	const showGoRef = useRef(false);

	useEffect(() => {
		const clearConn = Events.announcer.clearCountdown.connect(() => {
			setHide(true);
			setDescription("");
			setShowGo(false);
		});

		const conn = Events.announcer.countdown.connect(({ second, description, showGo = true }) => {
			showGoRef.current = showGo;
			setHide(false);
			setSeconds(second);
			setDescription(description ?? "");
		});

		return () => {
			conn.Disconnect();
			clearConn.Disconnect();
		};
	}, []);

	useEffect(() => {
		if (seconds <= 5) {
			ReplicatedStorage.Assets.Sounds.Countdown2.Play();
			ReplicatedStorage.Assets.Sounds.Countdown2.PlaybackSpeed = math.clamp(seconds / 5, 0.1, math.huge);
		}

		if (seconds === 0 && showGoRef.current === true) {
			setShowGo(true);
		}
	}, [seconds]);

	useEffect(() => {
		if (showGo === false) return;
		spawn(() => {
			ReplicatedStorage.Assets.Sounds["GO!!!"].Play();
			task.wait(0.5);
			setShowGo(false);
			setHide(true);
		});
	}, [showGo]);

	return { seconds, description, hide, showGo };
}

export default function CountdownApp() {
	let { seconds, description, hide, showGo } = useCountdown();
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
						seconds > 5 ? 255 : (seconds / 5) * 255,
						seconds > 5 ? 255 : (seconds / 5) * 255,
					),
					TextTransparency: showGo ? 1 : 0,
				}}
				transition={{
					duration: 0.2,
				}}
				Size={UDim2.fromOffset(px(125), px(125))}
				Text={`<b>${seconds}</b>`}
				Font={"Jura"}
				BackgroundTransparency={1}
				TextWrapped
				TextScaled
				RichText
			/>
			<motion.textlabel
				animate={{
					TextTransparency: showGo ? 1 : 0,
				}}
				transition={{
					duration: 0.2,
				}}
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(px(500), px(100))}
				Text={description}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled
			/>

			{showGo && (
				<motion.textlabel
					initial={{ TextTransparency: 1, Size: UDim2.fromOffset(px(200), px(200)) }}
					animate={{ TextTransparency: 0, Size: UDim2.fromOffset(px(250), px(250)) }}
					Text="GO!"
					Font={"Jura"}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(0, 255, 0)}
					TextScaled
					RichText
					transition={{
						duration: 0.2,
						easingStyle: Enum.EasingStyle.Back,
						easingDirection: Enum.EasingDirection.Out,
					}}
				/>
			)}
		</motion.frame>
	);
}
