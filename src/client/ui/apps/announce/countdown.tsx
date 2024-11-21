import React, { useEffect, useRef, useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { ReplicatedStorage } from "@rbxts/services";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

function useCountdown() {
	const [description, setDescription] = useState("");
	const [seconds, setSeconds] = useState<number>(0);
	const [hide, setHide] = useState(true);
	const [showGo, setShowGo] = useState(false);
	const initialSeconds = useRef<number | undefined>(undefined);
	const countdownLoop = useRef<thread | undefined>(undefined);

	useEffect(() => {
		const clearConn = Events.announcer.clearCountdown.connect(() => {
			if (countdownLoop.current) {
				task.cancel(countdownLoop.current);
				countdownLoop.current = undefined;
			}
			setHide(true);
			setDescription("");
			setShowGo(false);
			initialSeconds.current = undefined;
		});

		const conn = Events.announcer.countdown.connect(({ seconds, description, showGo = true }) => {
			if (countdownLoop.current) {
				task.cancel(countdownLoop.current);
			}

			initialSeconds.current = seconds;
			setDescription(description ?? "");
			setHide(false);
			setShowGo(false);

			countdownLoop.current = task.spawn(() => {
				for (let i = math.floor(seconds); i >= 0; i--) {
					if (initialSeconds.current === undefined) break;
					setSeconds(i);
					ReplicatedStorage.Assets.Sounds.Countdown2.Play();
					ReplicatedStorage.Assets.Sounds.Countdown2.PlaybackSpeed = math.clamp(
						i / initialSeconds.current,
						0.1,
						math.huge,
					);
					task.wait(1);
				}
				if (showGo) {
					setShowGo(true);
					task.wait(1);
				}
				setHide(true);
				task.wait(0.5);
				setShowGo(false);
				setDescription("");
				countdownLoop.current = undefined;
			});
		});

		return () => {
			if (countdownLoop.current) {
				task.cancel(countdownLoop.current);
			}
			conn.Disconnect();
			clearConn.Disconnect();
		};
	}, []);

	return { initialSeconds, seconds, description, hide, showGo };
}

export default function CountdownApp() {
	let { initialSeconds, seconds, description, hide, showGo } = useCountdown();

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
						seconds ? (seconds / (initialSeconds.current ?? 0)) * 255 : 255,
						seconds ? (seconds / (initialSeconds.current ?? 0)) * 255 : 255,
					),
				}}
				Size={UDim2.fromOffset(px(125), px(125))}
				Text={`<b>${seconds}</b>`}
				Font={"Jura"}
				BackgroundTransparency={1}
				TextWrapped
				TextScaled
				RichText
				Visible={!showGo}
			/>
			<textlabel
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(px(500), px(100))}
				Text={description}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled
				Visible={!showGo}
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
