import React from "@rbxts/react";
import { store } from "client/store";
import { px } from "client/ui/utils/usePx";
import { GuiPage } from "shared/configs/gui";

const BUTTONS: GuiPage[] = ["Inventory", "Shop", "Achievements", "Trading", "Settings"];
const BUTTON_SIZE = 50;

export default function MenuButtons() {
	return (
		<frame
			Size={new UDim2(0.75, 0, 0, 0)}
			Position={new UDim2(0.5, 0, 1, px(-150))}
			AnchorPoint={new Vector2(0.5, 0)}
			// BackgroundTransparency={1}
		>
			<uigridlayout
				FillDirection={Enum.FillDirection.Horizontal}
				CellPadding={new UDim2(0, px(BUTTON_SIZE), 0, 0)}
				CellSize={new UDim2(0, px(BUTTON_SIZE * 2), 0, px(BUTTON_SIZE * 2))}
			/>
			{BUTTONS.map((button) => {
				return (
					<textbutton
						Text={button}
						BackgroundColor3={Color3.fromRGB(100, 100, 100)}
						Event={{
							MouseButton1Click: () => {
								store.setGuiPage(button);
							},
						}}
					/>
				);
			})}
		</frame>
	);
}
