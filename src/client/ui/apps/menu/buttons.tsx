import React from "@rbxts/react";
import { store } from "client/store";
import ImageButton from "client/ui/components/image-button";
import { px } from "client/ui/utils/usePx";
import { GuiPage } from "shared/configs/gui";

const BUTTONS: { name: GuiPage; icon: string }[] = [
	{ name: "Inventory", icon: "rbxassetid://6035056487" },
	{ name: "Shop", icon: "rbxassetid://6031265976" },
];
const BUTTON_SIZE = 80;
const PADDING_SIZE = BUTTON_SIZE / 8;

export default function MenuButtonsApp() {
	return (
		<frame
			Size={
				new UDim2(0, px(BUTTON_SIZE), 0, px(BUTTON_SIZE) * BUTTONS.size() + px(PADDING_SIZE) * BUTTONS.size())
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
			{BUTTONS.map((button) => {
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
