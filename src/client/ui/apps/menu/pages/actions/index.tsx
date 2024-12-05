import React, { useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players } from "@rbxts/services";
import MenuFrame from "client/ui/components/menu-frame";
import { px } from "client/ui/utils/usePx";
import { ActionName, actions } from "shared/configs/action";

import { selectChallenge } from "shared/store/selectors/client";
import { selectPlayerBalance } from "shared/store/selectors/players";
import { BUTTONS } from "../../buttons";
import PlayerSelectModal from "./playerSelectModal";
import TokenPackagesModal from "./tokenPackagesModal";

const BUTTON = BUTTONS.find((b) => b.name === "Actions")!;

export default function ActionsPage() {
	const playerTokens = useSelector(selectPlayerBalance(tostring(Players.LocalPlayer.UserId), "action_tokens")) ?? 1;
	const [selectedActionName, setSelectedActionName] = useState<ActionName>();
	const [showTokenPackages, setShowTokenPackages] = useState(false);
	const currentChallenge = useSelector(selectChallenge);

	return (
		<>
			<MenuFrame header={{ title: BUTTON.name, icon: BUTTON.icon }}>
				<uilistlayout FillDirection={Enum.FillDirection.Vertical} Padding={new UDim(0, px(25))} />
				<frame BackgroundTransparency={1} Size={new UDim2(1, 0, 0.15, 0)} AutomaticSize={"Y"}>
					<uilistlayout
						Padding={new UDim(0, px(10))}
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>
					<textlabel
						Text={`Tokens: ${playerTokens}`}
						TextColor3={new Color3(1, 1, 1)}
						FontFace={Font.fromName("GothamBold")}
						TextSize={px(48)}
						AutomaticSize={"XY"}
						BackgroundTransparency={1}
						TextXAlignment={Enum.TextXAlignment.Center}
					/>

					<textbutton
						Text="Buy Tokens"
						Size={new UDim2(0, px(200), 0, px(50))}
						BackgroundColor3={new Color3(0.2, 0.6, 1)}
						TextColor3={new Color3(1, 1, 1)}
						FontFace={Font.fromName("GothamBold")}
						TextScaled={true}
						Event={{
							MouseButton1Click: () => {
								setShowTokenPackages(true);
							},
						}}
					>
						<uipadding
							PaddingTop={new UDim(0, px(8))}
							PaddingBottom={new UDim(0, px(8))}
							PaddingLeft={new UDim(0, px(8))}
							PaddingRight={new UDim(0, px(8))}
						/>
						<uicorner CornerRadius={new UDim(0, px(8))} />
					</textbutton>
				</frame>

				<frame BackgroundTransparency={1} Size={new UDim2(1, 0, 0, 0)} AutomaticSize={"Y"}>
					<uigridlayout
						CellPadding={new UDim2(0, px(20), 0, px(20))}
						CellSize={new UDim2(0, px(200), 0, px(150))}
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>
					{actions.map((action) => {
						const isBlacklisted =
							currentChallenge && action.blacklistedChallenges.includes(currentChallenge as never);
						const canAfford = playerTokens >= action.cost;
						const isDisabled = isBlacklisted || !canAfford;

						return (
							<frame
								BackgroundColor3={new Color3(0.1, 0.1, 0.1)}
								BorderSizePixel={0}
								BackgroundTransparency={isBlacklisted ? 0.5 : 0.1}
							>
								<uicorner CornerRadius={new UDim(0, px(10))} />
								<uipadding
									PaddingTop={new UDim(0, px(15))}
									PaddingBottom={new UDim(0, px(15))}
									PaddingLeft={new UDim(0, px(30))}
									PaddingRight={new UDim(0, px(30))}
								/>
								<uilistlayout
									Padding={new UDim(0, px(15))}
									FillDirection={Enum.FillDirection.Vertical}
									HorizontalAlignment={Enum.HorizontalAlignment.Center}
									VerticalAlignment={Enum.VerticalAlignment.Top}
								/>

								<textlabel
									Text={action.name}
									TextColor3={isBlacklisted ? new Color3(0.5, 0.5, 0.5) : new Color3(1, 1, 1)}
									FontFace={Font.fromName("GothamBold")}
									Size={new UDim2(1, 0, 0, px(40))}
									TextScaled
									BackgroundTransparency={1}
								/>

								{isBlacklisted ? (
									<textlabel
										Text="Not Available"
										TextColor3={new Color3(1, 0.3, 0.3)}
										FontFace={Font.fromName("GothamBold")}
										Size={new UDim2(1, 0, 0, px(30))}
										TextScaled
										BackgroundTransparency={1}
									/>
								) : (
									<textbutton
										Text={`${action.cost} Token${action.cost === 1 ? "" : "s"}`}
										TextSize={px(36)}
										AutomaticSize={"XY"}
										BackgroundColor3={
											canAfford ? new Color3(0.2, 0.6, 1) : new Color3(0.4, 0.4, 0.4)
										}
										TextColor3={new Color3(1, 1, 1)}
										FontFace={Font.fromName("GothamBold")}
										Event={{
											MouseButton1Click: () => {
												if (!isDisabled) {
													setSelectedActionName(action.name);
												} else if (!canAfford) {
													setShowTokenPackages(true);
												}
											},
										}}
									>
										<uipadding
											PaddingTop={new UDim(0, px(8))}
											PaddingBottom={new UDim(0, px(8))}
											PaddingLeft={new UDim(0, px(16))}
											PaddingRight={new UDim(0, px(16))}
										/>
										<uicorner CornerRadius={new UDim(0, px(8))} />
									</textbutton>
								)}
							</frame>
						);
					})}
				</frame>
			</MenuFrame>
			{selectedActionName && (
				<PlayerSelectModal actionName={selectedActionName} onClose={() => setSelectedActionName(undefined)} />
			)}
			{showTokenPackages && <TokenPackagesModal onClose={() => setShowTokenPackages(false)} />}
		</>
	);
}
