import React from "@rbxts/react";
import { Functions } from "client/network";
import { store } from "client/store";
import ImageButton from "client/ui/components/image-button";
import MenuFrame from "client/ui/components/menu-frame";
import { items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";
import { BUTTONS } from "../buttons";

const shopButton = BUTTONS.find((button) => button.name === "Shop")!;
export default function ShopApp() {
	return (
		<MenuFrame
			header={{
				icon: shopButton.icon,
				title: shopButton.name,
			}}
		>
			<uigridlayout CellSize={new UDim2(0, 100, 0, 100)} CellPadding={new UDim2(0, 10, 0, 10)} />
			{cases.map((caseObj) => {
				const itemNames = caseObj.items.mapFiltered((itemId) => items.get(itemId)?.name);
				return (
					<ImageButton
						image={"rbxassetid://6031094678"}
						onClick={() => {
							try {
								Functions.purchase.case(caseObj.id);
								store.setGuiPage(undefined);
							} catch (e) {
								// TODO: Show error message on UI
								warn(e);
							}
						}}
						toolTip={{
							header: caseObj.name,
							body: `Potential Items: ${itemNames.join(", ")}\n\nClick To Buy`,
						}}
					/>
				);
			})}
		</MenuFrame>
	);
}
