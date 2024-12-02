import React from "@rbxts/react";
import { Players } from "@rbxts/services";
import { getColor3FromLevel } from "shared/utils/functions/getColor3FromLevel";
import { DatastoreValue } from "./leaderboard";

interface PlayerProps {
	datastoreValue: DatastoreValue;
	index: number;
}

export default function Player({ index, datastoreValue }: PlayerProps) {
	const [thumbnail, _] = Players.GetUserThumbnailAsync(
		tonumber(datastoreValue.key) ?? 1,
		Enum.ThumbnailType.HeadShot,
		Enum.ThumbnailSize.Size100x100,
	);
	const name = Players.GetNameFromUserIdAsync(tonumber(datastoreValue.key) ?? 1);

	return (
		<frame Size={new UDim2(1, 0, 0, 75)} BackgroundTransparency={1} LayoutOrder={index}>
			<uilistlayout FillDirection={Enum.FillDirection.Horizontal} />

			<uipadding
				PaddingLeft={new UDim(0, 25)}
				PaddingRight={new UDim(0, 25)}
				PaddingTop={new UDim(0, 10)}
				PaddingBottom={new UDim(0, 10)}
			/>

			<textlabel Text={`${index}`} Size={UDim2.fromScale(0.1, 1)} TextScaled={true} BackgroundTransparency={1} />

			<imagelabel Image={thumbnail} Size={UDim2.fromScale(0.25, 1)} BackgroundTransparency={1} />

			<frame BackgroundTransparency={1} Size={UDim2.fromScale(0.1, 1)} />

			<textlabel Text={name} Size={UDim2.fromScale(0.4, 1)} BackgroundTransparency={1} TextScaled={true} />
			<textlabel
				Text={tostring(datastoreValue.value)}
				TextColor3={getColor3FromLevel(tonumber(datastoreValue.value) || 0)}
				Size={UDim2.fromScale(0.15, 1)}
				BackgroundTransparency={1}
				TextScaled={true}
			/>
		</frame>
	);
}
