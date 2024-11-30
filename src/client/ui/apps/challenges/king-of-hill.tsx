import Object from "@rbxts/object-utils";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";
import { KING_OF_HILL_CONFIG } from "shared/configs/challenges/king-of-hill";

type ScoreData = Map<string, number>;

export function KingOfHillChallenge() {
	const [scores, setScores] = useState<ScoreData>(new Map());

	useEffect(() => {
		const connection = Events.challenges.kingOfHillChallenge.updateScores.connect((newScores) => {
			setScores(newScores);
		});

		return () => connection.Disconnect();
	}, []);

	const sortedScores = useMemo(() => Object.entries(scores).sort(([, a], [, b]) => b - a > 0), [scores]);

	return (
		<frame BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
			<frame
				Size={new UDim2(0, px(300), 0, px(400))}
				Position={UDim2.fromScale(0.95, 0.05)}
				AnchorPoint={new Vector2(1, 0)}
				BackgroundTransparency={1}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					Padding={new UDim(0, px(10))}
				/>

				<textlabel
					Text={`SCORES (First to ${KING_OF_HILL_CONFIG.TARGET_SCORE})`}
					Size={new UDim2(1, 0, 0, px(40))}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={Enum.Font.SourceSansBold}
					TextScaled
				/>

				{sortedScores.map(([playerName, score]) => (
					<frame
						key={playerName}
						Size={new UDim2(1, 0, 0, px(35))}
						BackgroundColor3={Color3.fromRGB(40, 40, 40)}
						BackgroundTransparency={0.5}
					>
						<uicorner CornerRadius={new UDim(0, px(8))} />

						<textlabel
							Text={playerName}
							Size={new UDim2(0.6, 0, 1, 0)}
							Position={UDim2.fromScale(0, 0)}
							BackgroundTransparency={1}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.SourceSansBold}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextScaled
						>
							<uipadding PaddingLeft={new UDim(0, px(15))} />
						</textlabel>

						<textlabel
							Text={tostring(score)}
							Size={new UDim2(0.4, 0, 1, 0)}
							Position={UDim2.fromScale(0.6, 0)}
							BackgroundTransparency={1}
							TextColor3={Color3.fromRGB(255, 255, 0)}
							Font={Enum.Font.SourceSansBold}
							TextXAlignment={Enum.TextXAlignment.Right}
							TextScaled
						>
							<uipadding PaddingRight={new UDim(0, px(15))} />
						</textlabel>
					</frame>
				))}
			</frame>
		</frame>
	);
}
