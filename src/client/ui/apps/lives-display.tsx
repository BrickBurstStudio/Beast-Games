import React, { useEffect, useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { px } from "../utils/usePx";
import motion from "@rbxts/react-motion";

interface HeartBreakProps {
	onComplete: () => void;
}

function HeartBreakAnimation({ onComplete }: HeartBreakProps) {
	useEffect(() => {
		const timer = task.delay(1, () => {
			onComplete();
		});
		return () => task.cancel(timer);
	}, []);

	return (
		<motion.frame
			Size={new UDim2(0, px(100), 0, px(100))}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			initial={{
				Rotation: 0,
				Size: new UDim2(0, px(50), 0, px(50)),
			}}
			animate={{
				Rotation: 360,
				Size: new UDim2(0, px(150), 0, px(150)),
				Position: UDim2.fromScale(0.5, 0.7),
			}}
			transition={{
				duration: 0.5,
			}}
		>
			<imagelabel
				Image="rbxassetid://6022668898" // Heart icon asset ID (you'll need to replace this)
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
			>
				<motion.frame
					Size={UDim2.fromScale(0.5, 1)}
					Position={UDim2.fromScale(0, 0)}
					BackgroundTransparency={1}
					animate={{
						Position: new UDim2(-0.3, 0, 0, 0),
						Rotation: -30,
					}}
					transition={{
						duration: 0.5,
					}}
				>
					<imagelabel
						Image="rbxassetid://6022668898" // Same heart icon
						Size={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
					>
						<imagelabel
							Image="rbxassetid://6022668898" // Same heart icon
							Size={UDim2.fromScale(1, 1)}
							BackgroundTransparency={1}
							ImageRectSize={new Vector2(50, 100)}
						/>
					</imagelabel>
				</motion.frame>
				<motion.frame
					Size={UDim2.fromScale(0.5, 1)}
					Position={UDim2.fromScale(0.5, 0)}
					BackgroundTransparency={1}
					animate={{
						Position: new UDim2(0.8, 0, 0, 0),
						Rotation: 30,
					}}
					transition={{
						duration: 0.5,
					}}
				>
					<imagelabel
						Image="rbxassetid://6022668898" // Same heart icon
						Size={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
						ImageRectSize={new Vector2(50, 100)}
						ImageRectOffset={new Vector2(50, 0)}
					/>
				</motion.frame>
			</imagelabel>
		</motion.frame>
	);
}

export function LivesDisplay() {
	const [lives, setLives] = useState<number>();
	const [showAnimation, setShowAnimation] = useState(false);
	const previousLives = React.useRef(lives);

	useEffect(() => {
		setLives(Players.LocalPlayer.GetAttribute("lives") as number);
		const connection = Players.LocalPlayer.GetAttributeChangedSignal("lives").Connect(() => {
			const newLives = Players.LocalPlayer.GetAttribute("lives") as number;
			if (previousLives.current !== undefined && newLives < previousLives.current) {
				setShowAnimation(true);
			}
			previousLives.current = newLives;
			setLives(newLives);
		});

		return () => connection.Disconnect();
	}, []);

	return (
		<frame
			Size={new UDim2(0, px(120), 0, px(50))}
			Position={new UDim2(0.98, 0, 0.02, 0)}
			AnchorPoint={new Vector2(1, 0)}
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			BackgroundTransparency={0.5}
		>
			<uicorner CornerRadius={new UDim(0, px(8))} />
			<textlabel
				Text={`Lives: ${lives}`}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Font={Enum.Font.SourceSansBold}
				TextScaled
			>
				<uipadding
					PaddingLeft={new UDim(0, px(8))}
					PaddingRight={new UDim(0, px(8))}
					PaddingTop={new UDim(0, px(8))}
					PaddingBottom={new UDim(0, px(8))}
				/>
			</textlabel>
			{showAnimation && (
				<HeartBreakAnimation
					onComplete={() => {
						setShowAnimation(false);
					}}
				/>
			)}
		</frame>
	);
}
