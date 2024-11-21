import { FormatCompact, FormatStandard } from "@rbxts/format-number";
import React, { useEffect, useState } from "@rbxts/react";
import { Events } from "client/network";
import { LeaderboardProps } from ".";
import Player from "./player";
export interface DatastoreValue {
	key: string;
	value: number | string;
}

export default function Leaderboard(props: LeaderboardProps) {
	const [datastoreValues, setDatastoreValues] = useState<DatastoreValue[]>([]);

	useEffect(() => {
		Events.updateLeaderboards.connect((args) => {
			setDatastoreValues(
				args[props.datastoreName]
					.filter(({ key }) => (tonumber(key.split("_")[1]) ?? -1) > 0)
					.map(({ key, value }) => {
						const numberValue = tonumber(props.convertValue ? props.convertValue(value) : value);
						return {
							key: key.split("_")[1],
							value: numberValue !== undefined ? FormatStandard(numberValue) : value,
						};
					}),
			);
		});
	}, []);

	return (
		<>
			<uilistlayout FillDirection={Enum.FillDirection.Vertical} />

			<uipadding PaddingLeft={new UDim(0, 50)} PaddingRight={new UDim(0, 50)} />

			<textlabel
				Size={UDim2.fromScale(1, 0.1)}
				Text={`${props.name}`}
				BackgroundTransparency={1}
				TextScaled={true}
			/>

			<scrollingframe
				Size={UDim2.fromScale(1, 0.9)}
				CanvasSize={new UDim2(1, 0, 0, 75 * datastoreValues.size())}
				BackgroundTransparency={0.75}
				BackgroundColor3={Color3.fromRGB(27, 42, 53)}
				BorderSizePixel={0}
			>
				<uilistlayout FillDirection={Enum.FillDirection.Vertical} SortOrder={"LayoutOrder"} />
				{datastoreValues.map((datastoreValue, index) => {
					return <Player index={index + 1} datastoreValue={datastoreValue} />;
				})}
			</scrollingframe>
		</>
	);
}
