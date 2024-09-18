import React from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { px } from "client/ui/utils/usePx";

export default function AnnouncerApp() {
	return (
		<motion.frame
			BackgroundTransparency={1}
			Size={UDim2.fromOffset(px(1000), px(200))}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0)}
		>
			<textlabel
				Size={UDim2.fromScale(1, 1)}
				Text={"Welcome to Beast Games! You will be participating to win $5,000,000!"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={30}
				Font={"Jura"}
				BackgroundTransparency={1}
				TextWrapped
			></textlabel>
		</motion.frame>
	);
}
