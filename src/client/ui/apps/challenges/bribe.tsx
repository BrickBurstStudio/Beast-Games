import React from "@rbxts/react";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

export function BribeChallenge() {
	return (
		<textbutton
			Size={new UDim2(1, 0, 0, px(100))}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Text="Bribe"
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Event={{
				Activated: () => {
					Events.challenges.bribeChallenge.acceptBribe();
				},
			}}
		/>
	);
}
