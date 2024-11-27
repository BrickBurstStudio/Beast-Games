import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { MarketplaceService, Players } from "@rbxts/services";
import { Events } from "client/network";
import MenuFrame from "client/ui/components/menu-frame";
import { px } from "client/ui/utils/usePx";
import { actions } from "shared/configs/action";
import { selectPlayerActions } from "shared/store/selectors/players";

export default function ActionsPage() {
	const playerActions = useSelector(selectPlayerActions(tostring(Players.LocalPlayer.UserId)));

	return (
		<MenuFrame header={{ title: "Actions" }}>
			<uigridlayout
				CellPadding={new UDim2(0, px(16), 0, px(16))}
				CellSize={new UDim2(0, px(160), 0, px(180))}
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			{actions.map((action) => (
				<frame BackgroundColor3={new Color3(0.1, 0.1, 0.1)} BorderSizePixel={0} BackgroundTransparency={0.1}>
					<uicorner CornerRadius={new UDim(0, 8)} />
					<uipadding
						PaddingTop={new UDim(0, px(12))}
						PaddingBottom={new UDim(0, px(12))}
						PaddingLeft={new UDim(0, px(12))}
						PaddingRight={new UDim(0, px(12))}
					/>
					<uilistlayout
						Padding={new UDim(0, px(8))}
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					/>

					<textlabel
						Text={action.name}
						TextColor3={new Color3(1, 1, 1)}
						FontFace={Font.fromName("GothamBold")}
						TextSize={18}
						Size={new UDim2(1, 0, 0, px(20))}
						BackgroundTransparency={1}
					/>

					<textbutton
						Text="Use"
						Size={new UDim2(0.8, 0, 0, px(36))}
						BackgroundColor3={new Color3(0.2, 0.6, 1)}
						TextColor3={new Color3(1, 1, 1)}
						FontFace={Font.fromName("GothamBold")}
						TextSize={16}
						Event={{
							MouseButton1Click: () => {
								Events.useAction.fire({ actionId: action.id, toPlayer: Players.LocalPlayer });
							},
						}}
					>
						<uicorner CornerRadius={new UDim(0, 6)} />
					</textbutton>

					<frame Size={new UDim2(1, 0, 0, px(60))} BackgroundTransparency={1}>
						<uilistlayout
							Padding={new UDim(0, px(6))}
							FillDirection={Enum.FillDirection.Vertical}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
						/>
						<textlabel
							Text={`${playerActions?.filter((a) => a === action.id).size()} Token(s)`}
							TextColor3={new Color3(0.8, 0.8, 0.8)}
							FontFace={Font.fromName("Gotham")}
							TextSize={14}
							Size={new UDim2(1, 0, 0, px(20))}
							BackgroundTransparency={1}
						/>
						<textbutton
							Text="Buy 1 Token"
							Size={new UDim2(0.8, 0, 0, px(32))}
							BackgroundColor3={new Color3(0.2, 0.2, 0.2)}
							TextColor3={new Color3(1, 1, 1)}
							FontFace={Font.fromName("Gotham")}
							TextSize={14}
							Event={{
								MouseButton1Click: () => {
									MarketplaceService.PromptPurchase(Players.LocalPlayer, action.id);
								},
							}}
						>
							<uicorner CornerRadius={new UDim(0, 6)} />
						</textbutton>
					</frame>
				</frame>
			))}
		</MenuFrame>
	);
}
