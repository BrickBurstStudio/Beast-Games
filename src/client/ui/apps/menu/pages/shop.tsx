import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players } from "@rbxts/services";
import { Functions } from "client/network";
import { store } from "client/store";
import ImageButton from "client/ui/components/image-button";
import MenuFrame from "client/ui/components/menu-frame";
import { px } from "client/ui/utils/usePx";
import { COLORS } from "shared/configs/gui";
import { items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";
import { selectPlayerBalance } from "shared/store/selectors/players";
import { BUTTONS } from "../buttons";

const shopButton = BUTTONS.find((button) => button.name === "Shop")!;

export default function ShopApp() {
	const playerCash = useSelector(selectPlayerBalance(tostring(Players.LocalPlayer.UserId), "cash")) ?? 0;

	return (
		<MenuFrame
			header={{
				icon: shopButton.icon,
				title: shopButton.name,
			}}
		>
			<uigridlayout CellSize={new UDim2(0, px(150), 0, px(150))} CellPadding={new UDim2(0, px(10), 0, px(10))} />
			{cases.map((caseObj) => {
				const itemNames = caseObj.items.mapFiltered((itemId) => items.get(itemId)?.name);
				const canAfford = playerCash >= caseObj.price;

				return (
					<ImageButton
						image={"rbxassetid://6031094678"}
						backgroundColor3={canAfford ? undefined : new Color3(0.3, 0.3, 0.3)}
						onClick={async () => {
							if (!canAfford) {
								store.setMessage({
									title: "Cannot Afford",
									body: `You need $${caseObj.price} to purchase this case.\nYou have: $${playerCash}`,
									type: "error",
								});
								return;
							}

							const errorMessage = await Functions.purchase.case(caseObj.id);
							if (errorMessage) {
								store.setMessage({
									title: "Failed to Purchase",
									body: errorMessage,
									type: "error",
								});
							} else {
								store.setGuiPage(undefined);
							}
						}}
						toolTip={{
							header: caseObj.name,
							body: `Price: $${caseObj.price}\nPotential Items: ${itemNames.join(", ")}\n\n${canAfford ? "Click To Buy" : "Cannot Afford"}`,
						}}
					>
						<textlabel
							Text={`$${caseObj.price}`}
							Position={new UDim2(0.5, 0, 0, px(10))}
							Size={UDim2.fromScale(0.9, 0.2)}
							AnchorPoint={new Vector2(0.5, 0)}
							BackgroundTransparency={1}
							TextColor3={canAfford ? COLORS.White : new Color3(1, 0.3, 0.3)}
							TextScaled={true}
						/>
					</ImageButton>
				);
			})}
		</MenuFrame>
	);
}
