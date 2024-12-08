import React from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { store } from "client/store";
import ImageButton from "client/ui/components/image-button";
import { px } from "client/ui/utils/usePx";
import { GuiPage } from "shared/configs/gui";
import { LOBBY_PLACE_ID } from "shared/configs/places";

export type Button = {
	name: GuiPage;
	icon: string;
	showInLobby?: boolean;
};

export const BUTTONS: Button[] = [
	{ name: "Inventory", icon: "rbxassetid://6035056487", showInLobby: true },
	{ name: "Shop", icon: "rbxassetid://6031265976", showInLobby: true },
	{ name: "Actions", icon: "rbxassetid://6023565892", showInLobby: RunService.IsStudio() },
] as const;

const BUTTON_SIZE = 80;
const PADDING_SIZE = BUTTON_SIZE / 8;

export default function MenuButtonsApp() {
	const isLobby = game.PlaceId === LOBBY_PLACE_ID;
	const visibleButtons = BUTTONS.filter((button) => !isLobby || button.showInLobby);

	return (
		<frame
			Size={
				new UDim2(
					0,
					px(BUTTON_SIZE),
					0,
					px(BUTTON_SIZE) * visibleButtons.size() + px(PADDING_SIZE) * (visibleButtons.size() + 1),
				)
			}
			Position={new UDim2(0, px(PADDING_SIZE), 0.5, 0)}
			AnchorPoint={new Vector2(0, 0.5)}
			BackgroundTransparency={1}
		>
			<uigridlayout
				FillDirection={Enum.FillDirection.Vertical}
				CellPadding={new UDim2(0, 0, 0, px(PADDING_SIZE) * 2)}
				CellSize={new UDim2(0, px(BUTTON_SIZE), 0, px(BUTTON_SIZE))}
			/>
			{visibleButtons.map((button) => {
				return (
					<ImageButton
						image={button.icon}
						onClick={() => {
							store.setGuiPage(button.name);
						}}
						toolTip={{ header: button.name }}
					/>
				);
			})}
		</frame>
	);
}
