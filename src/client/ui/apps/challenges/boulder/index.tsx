import React from "@rbxts/react";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

export default function BoulderChallenge() {
	return (
		<>
			<textbutton
				Text="Boulder Challenge"
				Size={UDim2.fromOffset(px(300), px(50))}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={px(24)}
				Position={UDim2.fromScale(0.25, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={0.5}
				Event={{
					MouseButton1Click: () => {
						Events.challenges.boulderChallenge.pull();
					},
				}}
			/>
		</>
	);
}
