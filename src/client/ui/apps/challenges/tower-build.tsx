import React from "@rbxts/react";
import { Events } from "client/network";

export default function TowerBuildChallenge() {
	return (
		<textbutton
			Text="Click to Place Block!"
			Size={UDim2.fromScale(0.2, 0.1)}
			Position={UDim2.fromScale(0.4, 0.8)}
			BackgroundColor3={Color3.fromRGB(0, 170, 255)}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Event={{
				MouseButton1Click: () => {
					Events.challenges.towerBuildChallenge.click.fire();
				},
			}}
		>
			<uicorner CornerRadius={new UDim(0.5, 0)} />
		</textbutton>
	);
}
