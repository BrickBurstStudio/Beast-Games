import { CharacterRigR6 } from "@rbxts/promise-character";
import React, { useEffect, useRef, useState } from "@rbxts/react";
import { Players, Workspace } from "@rbxts/services";
import { store } from "client/store";
import { px } from "client/ui/utils/usePx";
import { COLORS } from "shared/configs/gui";

function useSpectate() {
	const index = useRef(0);
	const [player, setPlayer] = useState<Player>();

	if (player === undefined) {
		const player = Players.GetPlayers().filter((p) => p.Character !== undefined && p !== Players.LocalPlayer)[0];
		if (player) setPlayer(player);
	}

	useEffect(() => {
		try {
			if (player) Workspace.CurrentCamera!.CameraSubject = (player.Character as CharacterRigR6)?.Head;
		} catch (e) {
			warn(e);
		}
	}, [player]);

	return [
		(direction: -1 | 1) => {
			index.current += direction;
			const spectatablePlayers = Players.GetPlayers().filter(
				(p) => p.Character !== undefined && p !== Players.LocalPlayer,
			);
			const player = spectatablePlayers[index.current % spectatablePlayers.size()];
			setPlayer(player);
		},
		player,
	] as const;
}

export default function SpectateApp() {
	const [spectateChange, player] = useSpectate();

	return (
		<>
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
			<textbutton
				BackgroundColor3={COLORS.Primary}
				TextColor3={COLORS.White}
				Position={new UDim2(0.5, 0, 0.95, 0)}
				AnchorPoint={new Vector2(0.5, 1)}
				TextScaled
				Text="Actions"
				Size={new UDim2(0, px(200), 0, px(100))}
				Event={{
					MouseButton1Click: () => {
						store.setGuiPage("Actions");
					},
				}}
			>
				<uipadding
					PaddingBottom={new UDim(0, px(10))}
					PaddingLeft={new UDim(0, px(10))}
					PaddingRight={new UDim(0, px(10))}
					PaddingTop={new UDim(0, px(10))}
				/>
				<uicorner CornerRadius={new UDim(0, px(10))} />
			</textbutton>
		</>
	);
}
