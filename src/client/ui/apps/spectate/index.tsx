import { CharacterRigR6 } from "@rbxts/promise-character";
import React, { useEffect, useRef, useState } from "@rbxts/react";
import { Players, TeleportService, Workspace } from "@rbxts/services";
import { px } from "client/ui/utils/usePx";
import { COLORS } from "shared/configs/gui";
import { LOBBY_PLACE_ID } from "shared/configs/places";

function useSpectate() {
	const [index, setIndex] = useState(0);
	const [player, setPlayer] = useState<Player>();

	if (player === undefined) {
		const player = Players.GetPlayers().filter(
			(p) =>
				p.Character !== undefined &&
				p.Character.FindFirstChild("Head") !== undefined &&
				p !== Players.LocalPlayer,
		)[0];
		if (player) setPlayer(player);
	}

	useEffect(() => {
		try {
			if (player) Workspace.CurrentCamera!.CameraSubject = (player.Character as CharacterRigR6)?.Head;
		} catch (e) {
			warn(e);
		}
	}, [player]);

	useEffect(() => {
		return () => {
			const spectatablePlayers = Players.GetPlayers().filter(
				(p) =>
					p.Character?.Parent !== undefined &&
					p.Character.FindFirstChild("Head") &&
					p !== Players.LocalPlayer,
			);
			const player = spectatablePlayers[index % spectatablePlayers.size()];
			setPlayer(player);
		};
	}, [index]);

	useEffect(() => {
		let cntrl = true;
		task.spawn(() => {
			while (cntrl) {
				task.wait(0.5);

				if (player?.Character?.FindFirstChild("Head") === undefined) {
					setIndex(index + 1);
				}
			}
		});
		return () => {
			cntrl = false;
		};
	}, [player]);

	return [
		(direction: -1 | 1) => {
			setIndex(index + direction);
		},
		player,
	] as const;
}

export default function SpectateApp() {
	const [spectateChange, player] = useSpectate();
	const [lives, setLives] = useState(Players.LocalPlayer.GetAttribute("lives") as number | undefined);

	useEffect(() => {
		const connection = Players.LocalPlayer.GetAttributeChangedSignal("lives").Connect(() => {
			setLives(Players.LocalPlayer.GetAttribute("lives") as number);
		});

		return () => connection.Disconnect();
	}, []);

	return (
		<>
			{lives !== undefined && (
				<frame
					BackgroundTransparency={0.5}
					BackgroundColor3={lives > 0 ? COLORS.Primary : Color3.fromRGB(200, 0, 0)}
					Position={new UDim2(0.5, 0, 0.05, 0)}
					AnchorPoint={new Vector2(0.5, 0)}
					Size={new UDim2(0, px(600), 0, px(80))}
				>
					<uicorner CornerRadius={new UDim(0, px(10))} />

					<textlabel
						Text={
							lives > 0
								? `You have ${lives} ${lives === 1 ? "life" : "lives"} remaining - You will respawn next round!`
								: "You are eliminated - No lives remaining"
						}
						TextColor3={COLORS.White}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 1)}
						TextScaled={true}
						Font={Enum.Font.SourceSansBold}
					>
						<uipadding PaddingLeft={new UDim(0, px(20))} PaddingRight={new UDim(0, px(20))} />
					</textlabel>
				</frame>
			)}
			<frame
				BackgroundTransparency={1}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={new UDim2(0, px(250), 0.95, 0)}
				AutomaticSize={"XY"}
			>
				<uilistlayout FillDirection={"Horizontal"} />
				<textbutton
					BackgroundTransparency={0.5}
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					TextScaled
					Text={"<"}
					TextColor3={COLORS.White}
					Size={new UDim2(0, px(100), 0, px(100))}
					Event={{
						MouseButton1Click: () => {
							spectateChange(-1);
						},
					}}
				>
					<uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={px(2)} />
					<uicorner CornerRadius={new UDim(0, px(10))} />
				</textbutton>
				<textlabel
					TextScaled
					BackgroundTransparency={0.5}
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					Text={player?.Name ?? "N/A"}
					TextColor3={COLORS.White}
					Size={new UDim2(0, px(200), 0, px(100))}
				>
					<uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={px(2)} />
					<uicorner CornerRadius={new UDim(0, px(10))} />
				</textlabel>
				<textbutton
					BackgroundTransparency={0.5}
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					TextScaled
					Text={">"}
					TextColor3={COLORS.White}
					Size={new UDim2(0, px(100), 0, px(100))}
					Event={{
						MouseButton1Click: () => {
							spectateChange(1);
						},
					}}
				>
					<uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={px(2)} />
					<uicorner CornerRadius={new UDim(0, px(10))} />
				</textbutton>
			</frame>
			{lives !== undefined && lives <= 0 && (
				<textbutton
					BackgroundColor3={COLORS.Primary}
					TextColor3={COLORS.White}
					Position={new UDim2(0.5, 0, 0.95, 0)}
					AnchorPoint={new Vector2(0.5, 1)}
					TextScaled
					Text="Back to Lobby"
					Size={new UDim2(0, px(300), 0, px(100))}
					Event={{
						MouseButton1Click: () => {
							TeleportService.Teleport(LOBBY_PLACE_ID);
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
			)}
		</>
	);
}
