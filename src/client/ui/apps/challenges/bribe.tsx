import React, { useEffect } from "@rbxts/react";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";
import { BribeChallengeData } from "../../../../../types/BribeChallengeData";
import { FormatStandard } from "@rbxts/format-number";

export function BribeChallenge() {
	const [accepted, setAccepted] = React.useState(false);
	const [disabled, setDisabled] = React.useState(false);
	const [bribeData, setBribeData] = React.useState<BribeChallengeData>({
		playerCount: 0,
		originalAmount: 0,
	});

	useEffect(() => {
		Events.challenges.bribeChallenge.updateBribe.connect(setBribeData);
		Events.challenges.bribeChallenge.disableBribe.connect(() => setDisabled(true));
	}, []);

	return disabled ? (
		<></>
	) : (
		<frame BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
			<frame
				Size={new UDim2(0, px(600), 0, px(100))}
				Position={new UDim2(0.5, 0, 0, px(220))}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 0.5)}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				<textlabel
					Size={new UDim2(1, 0, 0.5, 0)}
					BackgroundTransparency={1}
					Text={`$${FormatStandard(bribeData.originalAmount)} / ${bribeData.playerCount} players`}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={Enum.Font.SourceSansBold}
					TextScaled
				/>
				<textlabel
					Size={new UDim2(1, 0, 1, 0)}
					BackgroundTransparency={1}
					Text={`$${FormatStandard(math.round(bribeData.originalAmount / (bribeData.playerCount === 0 ? 1 : bribeData.playerCount)))}`}
					TextColor3={Color3.fromRGB(48, 237, 31)}
					Font={Enum.Font.SourceSansBold}
					TextScaled
				/>
			</frame>
			{!accepted ? (
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
							setAccepted(true);
						},
					}}
					Font={Enum.Font.SourceSansBold}
					TextScaled
				>
					<uicorner CornerRadius={new UDim(0, px(10))} />
					<uipadding PaddingLeft={new UDim(0, px(20))} PaddingRight={new UDim(0, px(20))} />
				</textbutton>
			) : (
				<textlabel
					Size={new UDim2(0, px(400), 0, px(100))}
					Position={UDim2.fromScale(0.5, 0.75)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Text="ACCEPTED BRIBE"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					Font={Enum.Font.SourceSansBold}
					TextScaled
				>
					<uicorner CornerRadius={new UDim(0, px(10))} />
					<uipadding PaddingLeft={new UDim(0, px(20))} PaddingRight={new UDim(0, px(20))} />
				</textlabel>
			)}
		</frame>
	);
}
