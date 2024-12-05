import React, { useState, useEffect } from "@rbxts/react";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

export function SplitOrStealChallenge() {
	const [choice, setChoice] = useState<"split" | "steal" | undefined>(undefined);
	const [showButtons, setShowButtons] = useState(true);

	useEffect(() => {
		const connections = [
			Events.announcer.clearCountdown.connect(() => {
				setShowButtons(false);
			}),
		];

		return () => connections.forEach((conn) => conn.Disconnect());
	}, []);

	const makeChoice = (selectedChoice: "split" | "steal") => {
		if (choice !== undefined) return;
		setChoice(selectedChoice);
		setShowButtons(false);
		Events.challenges.splitOrStealChallenge.makeChoice(selectedChoice);
	};

	if (!showButtons) return <></>;

	return (
		<frame BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
			<frame
				Size={new UDim2(0, px(800), 0, px(200))}
				Position={UDim2.fromScale(0.5, 0.75)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, px(20))}
				/>

				<textbutton
					Size={new UDim2(0, px(300), 0, px(100))}
					Text="SPLIT"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundColor3={choice === "split" ? Color3.fromRGB(0, 200, 0) : Color3.fromRGB(0, 150, 0)}
					TextScaled
					Font={Enum.Font.SourceSansBold}
					Event={{
						Activated: () => makeChoice("split"),
					}}
				>
					<uicorner CornerRadius={new UDim(0, px(10))} />
				</textbutton>

				<textbutton
					Size={new UDim2(0, px(300), 0, px(100))}
					Text="STEAL"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundColor3={choice === "steal" ? Color3.fromRGB(200, 0, 0) : Color3.fromRGB(150, 0, 0)}
					TextScaled
					Font={Enum.Font.SourceSansBold}
					Event={{
						Activated: () => makeChoice("steal"),
					}}
				>
					<uicorner CornerRadius={new UDim(0, px(10))} />
				</textbutton>
			</frame>
		</frame>
	);
}
