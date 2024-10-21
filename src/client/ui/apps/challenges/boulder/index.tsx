import React, { useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

const padding = 40;

export default function BoulderChallenge() {
	const [clicked, setClicked] = useState(false);

	return (
		<>
			<motion.textbutton
				animate={{ Size: clicked ? UDim2.fromOffset(px(375), px(125)) : UDim2.fromOffset(px(400), px(150)) }}
				initial={{ Size: UDim2.fromOffset(px(400), px(150)) }}
				Text="CLICK TO PULL!"
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={px(24)}
				Position={UDim2.fromScale(0.5, 0.6)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={0.5}
				TextScaled
				Event={{
					MouseButton1Click: () => {
						setClicked(true);
						Events.challenges.boulderChallenge.pull();
						task.wait(0.1);
						setClicked(false);
					},
				}}
				transition={{
					duration: 0.1,
					easingStyle: Enum.EasingStyle.Linear,
					reverses: true,
					delay: 0,
				}}
			>
				<uicorner CornerRadius={new UDim(0.25, 0)} />
				<uipadding
					PaddingLeft={new UDim(0, px(padding))}
					PaddingRight={new UDim(0, px(padding))}
					PaddingTop={new UDim(0, px(padding))}
					PaddingBottom={new UDim(0, px(padding))}
				/>
			</motion.textbutton>
		</>
	);
}
