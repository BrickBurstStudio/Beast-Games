import React from "@rbxts/react";
import { Functions } from "client/network";
import { store } from "client/store";
import ImageButton from "client/ui/components/image-button";
import MenuFrame from "client/ui/components/menu-frame";
import { cases } from "shared/configs/items/cases";

export default function ShopApp() {
	return (
		<MenuFrame
			header={{
				icon: "rbxassetid://3926305904",
				title: "Shop",
			}}
		>
			<uigridlayout CellSize={new UDim2(0, 100, 0, 100)} CellPadding={new UDim2(0, 10, 0, 10)} />
			{cases.map((caseObj) => {
				return (
					<ImageButton
						image={"rbxassetid://3926305904"}
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
							body: `Potential Items: ${caseObj.items.join(", ")}\n\nClick To Buy`,
						}}
					/>
				);
			})}
		</MenuFrame>
	);
}
