import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players } from "@rbxts/services";
import { Functions } from "client/network";
import { store } from "client/store";
import ImageButton from "client/ui/components/image-button";
import MenuFrame from "client/ui/components/menu-frame";
import { items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";
import { selectPlayerItems } from "shared/store/selectors/players";

export default function InventoryApp() {
	const inventory = useSelector(selectPlayerItems(tostring(Players.LocalPlayer.UserId)));
	// const inventory = useSelector(selectPlayerItems("test"));

	return (
		<MenuFrame
			header={{
				icon: "rbxassetid://",
				title: "Inventory",
			}}
		>
			<uigridlayout CellSize={new UDim2(0, 100, 0, 100)} CellPadding={new UDim2(0, 10, 0, 10)} />
			{inventory
				?.map((itemId) => {
					const item = items.get(itemId);
					if (!item) return <></>;
					return (
						<ImageButton
							image={"rbxassetid://3926305904"}
							onClick={() => {
								store.setGuiPage(undefined);
								Functions.inventory.openCase(itemId as typeof cases[number]["id"]);
							}}
							toolTip={{ header: item.name, body: "Click To Open" }}
						/>
					);
				})}
		</MenuFrame>
	);
}
