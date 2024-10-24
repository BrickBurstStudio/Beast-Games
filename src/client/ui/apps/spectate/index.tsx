import { CharacterRigR6 } from "@rbxts/promise-character";
import React, { useEffect, useState } from "@rbxts/react";
import { reverseArray } from "@rbxts/reverse-array";
import { Players, RunService, Workspace } from "@rbxts/services";
import { px } from "client/ui/utils/usePx";
import { forEveryPlayer } from "shared/utils/functions/forEveryPlayer";

function useSpectate() {
	const [index, setIndex] = useState(0);
	const [player, setPlayer] = useState<Player>();

	useEffect(() => {
		const player = Players.GetPlayers()[index];
		Workspace.CurrentCamera!.CameraSubject = (player.Character as CharacterRigR6)?.Head;
		setPlayer(player);
	}, [index]);

	return [
		(direction: 1 | -1) => {
			const newIndex = Players.GetPlayers().findIndex(
				(p, i) => !p.GetAttribute("eliminated") && (direction === 1 ? i > index : i < index),
			);
			setIndex(newIndex === -1 ? Players.GetPlayers().findIndex((p) => !p.GetAttribute("eliminated")) : newIndex);
			
		},
		player,
	] as const;
}

export default function SpectateApp() {
	const [spectateChange, player] = useSpectate();

	return (
		<frame
			BackgroundTransparency={0}
			AutomaticSize={"XY"}
			Position={new UDim2(0.95, 0, 1, 0)}
			AnchorPoint={new Vector2(1, 1)}
		>
			<uilistlayout FillDirection={"Horizontal"} />
			<textbutton
				Text={"<"}
				Size={new UDim2(0, px(100), 0, px(100))}
				Event={{
					MouseButton1Click: () => {
						spectateChange(-1);
					},
				}}
			/>
			<textlabel Text={player?.Name ?? "N/A"} Size={new UDim2(0, px(100), 0, px(100))} />
			<textbutton
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
