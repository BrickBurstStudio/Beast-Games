import React from "@rbxts/react";
import { Players } from "@rbxts/services";
import { Events } from "client/network";
import Modal from "client/ui/components/modal";
import { px } from "client/ui/utils/usePx";
import { ActionId } from "shared/configs/action";

interface PlayerSelectModalProps {
	actionId: ActionId;
	onClose: () => void;
}

export default function PlayerSelectModal({ actionId, onClose }: PlayerSelectModalProps) {
	return (
		<Modal
			title="Select Target Player"
			onClose={onClose}
			children={
				<scrollingframe
					Size={new UDim2(1, -px(32), 1, -px(120))}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					ScrollBarThickness={8}
					ScrollBarImageColor3={new Color3(1, 1, 1)}
				>
					<uilistlayout
						Padding={new UDim(0, px(8))}
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
					/>
					{Players.GetPlayers().map((player) => (
						<textbutton
							key={player.UserId}
							Text={player.DisplayName}
							TextColor3={new Color3(1, 1, 1)}
							FontFace={Font.fromName("Gotham")}
							TextSize={16}
							Size={new UDim2(1, 0, 0, px(40))}
							BackgroundColor3={new Color3(0.2, 0.2, 0.2)}
							Event={{
								MouseButton1Click: () => {
									Events.useAction.fire({ actionId, toPlayer: player });
									onClose();
								},
							}}
						>
							<uicorner CornerRadius={new UDim(0, 6)} />
						</textbutton>
					))}
				</scrollingframe>
			}
		/>
	);
}
