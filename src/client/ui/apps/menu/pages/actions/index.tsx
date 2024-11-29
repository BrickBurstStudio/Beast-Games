import React, { useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players } from "@rbxts/services";
import MenuFrame from "client/ui/components/menu-frame";
import { px } from "client/ui/utils/usePx";
import { ActionId, actions } from "shared/configs/action";
import { selectPlayerActionTokens } from "shared/store/selectors/players";
import PlayerSelectModal from "./playerSelectModal";
import TokenPackagesModal from "./tokenPackagesModal";
import { BUTTONS } from "../../buttons";

const BUTTON = BUTTONS.find((b) => b.name === "Actions")!;

export default function ActionsPage() {
	const playerTokens = useSelector(selectPlayerActionTokens(tostring(Players.LocalPlayer.UserId))) ?? 1;
	const [selectedActionId, setSelectedActionId] = useState<ActionId>();
	const [showTokenPackages, setShowTokenPackages] = useState(false);

	return (
		<>
			<MenuFrame header={{ title: BUTTON.name, icon: BUTTON.icon }}>
				<frame Size={new UDim2(1, 0, 0, px(60))} BackgroundTransparency={1}>
					<uilistlayout
						Padding={new UDim(0, px(6))}
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
					/>
					<textlabel
						Text={`Tokens: ${playerTokens}`}
						TextColor3={new Color3(1, 1, 1)}
						FontFace={Font.fromName("GothamBold")}
						TextSize={24}
						Size={new UDim2(1, 0, 0, px(50))}
						BackgroundTransparency={1}
						TextXAlignment={Enum.TextXAlignment.Center}
					/>

					<textbutton
						Text="Buy Token"
						AutomaticSize={Enum.AutomaticSize.XY}
						BackgroundColor3={new Color3(0.2, 0.6, 1)}
						TextColor3={new Color3(1, 1, 1)}
						FontFace={Font.fromName("GothamBold")}
						TextSize={16}
						Event={{
							MouseButton1Click: () => {
								setShowTokenPackages(true);
							},
						}}
					>
						<uipadding
							PaddingTop={new UDim(0, px(12))}
							PaddingBottom={new UDim(0, px(12))}
							PaddingLeft={new UDim(0, px(12))}
							PaddingRight={new UDim(0, px(12))}
						/>
						<uicorner CornerRadius={new UDim(0, 6)} />
					</textbutton>
				</frame>

				<uigridlayout
					CellPadding={new UDim2(0, px(16), 0, px(16))}
					CellSize={new UDim2(0, px(160), 0, px(180))}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				{actions.map((action) => (
					<frame
						BackgroundColor3={new Color3(0.1, 0.1, 0.1)}
						BorderSizePixel={0}
						BackgroundTransparency={0.1}
					>
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
							BackgroundColor3={
								playerTokens >= action.cost ? new Color3(0.2, 0.6, 1) : new Color3(0.4, 0.4, 0.4)
							}
							TextColor3={new Color3(1, 1, 1)}
							FontFace={Font.fromName("GothamBold")}
							TextSize={16}
							Event={{
								MouseButton1Click: () => {
									if (playerTokens >= action.cost) {
										setSelectedActionId(action.id);
									} else {
										setShowTokenPackages(true);
									}
								},
							}}
						>
							<uicorner CornerRadius={new UDim(0, 6)} />
						</textbutton>

						<textlabel
							Text={`Cost: ${action.cost} Token${action.cost === 1 ? "" : "s"}`}
							TextColor3={new Color3(0.8, 0.8, 0.8)}
							FontFace={Font.fromName("Gotham")}
							TextSize={14}
							Size={new UDim2(1, 0, 0, px(20))}
							BackgroundTransparency={1}
						/>
					</frame>
				))}
			</MenuFrame>
			{selectedActionId !== undefined && (
				<PlayerSelectModal actionId={selectedActionId} onClose={() => setSelectedActionId(undefined)} />
			)}
			{showTokenPackages && <TokenPackagesModal onClose={() => setShowTokenPackages(false)} />}
		</>
	);
}
