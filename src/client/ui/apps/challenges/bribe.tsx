import React from "@rbxts/react";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

export function BribeChallenge() {
	const [clicked, setClicked] = React.useState(false);

	return clicked ? (
		<></>
	) : (
		<textbutton
			Size={new UDim2(0, px(400), 0, px(100))}
			Position={UDim2.fromScale(0.5, 0.75)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Text="ACCEPT BRIBE"
			TextColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundColor3={Color3.fromRGB(24, 240, 60)}
			Event={{
				Activated: () => {
					Events.challenges.bribeChallenge.acceptBribe();
					setClicked(true);
				},
			}}
			Font={Enum.Font.SourceSansBold}
			TextScaled
		>
			<uicorner CornerRadius={new UDim(0, px(10))} />
			<uipadding PaddingLeft={new UDim(0, px(20))} PaddingRight={new UDim(0, px(20))} />
		</textbutton>
	);
}
