import React from "@rbxts/react";
import { store } from "client/store";
import ImageButton from "client/ui/components/image-button";
import { px } from "client/ui/utils/usePx";
import { GuiPage } from "shared/configs/gui";

const BUTTONS: GuiPage[] = ["Inventory", "Shop", "Achievements", "Trading", "Settings"];
const BUTTON_SIZE = 100;
const PADDING_SIZE = BUTTON_SIZE / 4;

export default function MenuButtons() {
	return (
		<frame
			Size={
				new UDim2(
					0,
					px(BUTTON_SIZE) * BUTTONS.size() + px(PADDING_SIZE) * (BUTTONS.size() - 1),
					0,
					px(BUTTON_SIZE),
				)
			}
			Position={new UDim2(0.5, 0, 1, px(-(BUTTON_SIZE + PADDING_SIZE)))}
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
		>
			<uigridlayout
				FillDirection={Enum.FillDirection.Horizontal}
				CellPadding={new UDim2(0, px(PADDING_SIZE), 0, 0)}
				CellSize={new UDim2(0, px(BUTTON_SIZE), 0, px(BUTTON_SIZE))}
			/>
			{BUTTONS.map((button) => {
				return (
					<ImageButton
						image="rbxassetid://3926305904"
						onClick={() => {
							store.setGuiPage(button);
						}}
					/>
				);
			})}
		</frame>
	);
}
