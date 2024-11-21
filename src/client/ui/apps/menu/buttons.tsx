import React from "@rbxts/react";
import { store } from "client/store";
import ImageButton from "client/ui/components/image-button";
import { px } from "client/ui/utils/usePx";
import { GuiPage } from "shared/configs/gui";

const BUTTONS: GuiPage[] = ["Inventory", "Shop", "Achievements", "Trading", "Settings"];
const BUTTON_SIZE = 100;
const PADDING_SIZE = BUTTON_SIZE / 8;

export default function MenuButtonsApp() {
	return (
		<frame
			Size={
				new UDim2(
					0,
					px(BUTTON_SIZE),
					0,
					px(BUTTON_SIZE) * BUTTONS.size() + px(PADDING_SIZE) * (BUTTONS.size() - 1),
				)
			}
			Position={new UDim2(0, px(PADDING_SIZE), 0.5, 0)}
			AnchorPoint={new Vector2(0, 0.5)}
			BackgroundTransparency={1}
		>
			<uigridlayout
				FillDirection={Enum.FillDirection.Vertical}
				CellPadding={new UDim2(0, 0, 0, px(PADDING_SIZE))}
				CellSize={new UDim2(0, px(BUTTON_SIZE), 0, px(BUTTON_SIZE))}
			/>
			{BUTTONS.map((button) => {
				return (
					<ImageButton
						image="rbxassetid://images/plus.png"
						onClick={() => {
							store.setGuiPage(button);
						}}
						toolTip={{ header: button }}
					/>
				);
			})}
		</frame>
	);
}
