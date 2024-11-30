import React, { useEffect, useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { px } from "../utils/usePx";

export function LivesDisplay() {
	const [lives, setLives] = useState<number>(3);

	useEffect(() => {
		const connection = Players.LocalPlayer.GetAttributeChangedSignal("lives").Connect(() => {
			setLives(Players.LocalPlayer.GetAttribute("lives") as number);
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
		</frame>
	);
}
