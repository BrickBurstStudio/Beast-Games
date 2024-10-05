import React, { ReactElement, useEffect, useRef, useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";
import { BORDER_THICKNESS, COLORS } from "shared/configs/gui";

export default function AnimateEventsApp() {
	const [levelUpActive, setLevelUpActive] = useState(false);
	const levelRef = useRef(0);

	useEffect(() => {
		const connections = [
			Events.animations.levelUp.connect((level: number) => {
				print(`Level up to ${level}`);
				levelRef.current = level;
				setLevelUpActive(true);
				task.wait(3);
				setLevelUpActive(false);
			}),
		];

		return () => {
			connections.forEach((c) => c.Disconnect());
		};
	}, []);

	return (
		<>
			<motion.frame
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.2)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				animate={{
					Size: levelUpActive ? UDim2.fromOffset(px(500), px(200)) : UDim2.fromOffset(0, 0),
				}}
				transition={{
					easingStyle: "Back",
					easingDirection: "Out",
				}}
				initial={{ Size: UDim2.fromOffset(0, 0) }}
				AutomaticSize={"X"}
			>
				<motion.textlabel
					animate={{
						TextTransparency: levelUpActive ? 0 : 1,
					}}
					initial={{
						TextTransparency: 1,
					}}
					transition={{
						duration: 0.25,
					}}
					TextColor3={COLORS.White}
					Font={"Highway"}
					Text={`LEVEL ${levelRef.current}!`}
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					TextScaled
				/>
			</motion.frame>
		</>
	);
}
