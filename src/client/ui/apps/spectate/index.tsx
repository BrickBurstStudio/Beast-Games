import { CharacterRigR6 } from "@rbxts/promise-character";
import React, { useEffect, useRef, useState } from "@rbxts/react";
import { reverseArray } from "@rbxts/reverse-array";
import { Players, RunService, Workspace } from "@rbxts/services";
import { px } from "client/ui/utils/usePx";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

function useSpectate() {
	const index = useRef(0);
	const [player, setPlayer] = useState<Player>();

	return [
		(direction: 1 | -1) => {
			index.current += direction;
			const spectatablePlayers = Players.GetPlayers().filter(
				(p) => p.Character !== undefined && p !== Players.LocalPlayer,
			);
			const player = spectatablePlayers[index.current % spectatablePlayers.size()];
			Workspace.CurrentCamera!.CameraSubject = (player.Character as CharacterRigR6)?.Head;
			setPlayer(player);
		},
		player,
	] as const;
}

export default function SpectateApp() {
	const [spectateChange, player] = useSpectate();

	return (
		<frame
			BackgroundTransparency={1}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			AnchorPoint={new Vector2(0.5, 1)}
			Position={new UDim2(0, px(250), 0.95, 0)}
			// Size={UDim2.fromOffset(px(200), px(200))}
			AutomaticSize={"XY"}
		>
			<uilistlayout FillDirection={"Horizontal"} />
			<textbutton
				BackgroundTransparency={1}
				TextScaled
				Text={"<"}
				Size={new UDim2(0, px(100), 0, px(100))}
				Event={{
					MouseButton1Click: () => {
						spectateChange(-1);
					},
				}}
			/>
			<textlabel
				TextScaled
				BackgroundTransparency={1}
				Text={player?.Name ?? "N/A"}
				Size={new UDim2(0, px(200), 0, px(100))}
			/>
			<textbutton
				BackgroundTransparency={1}
				TextScaled
				Text={">"}
				Size={new UDim2(0, px(100), 0, px(100))}
				Event={{
					MouseButton1Click: () => {
						spectateChange(1);
					},
				}}
			/>
		</frame>
	);
}
