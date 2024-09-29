import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players } from "@rbxts/services";
import { Functions } from "client/network";
import { store } from "client/store";
import ImageButton from "client/ui/components/image-button";
import MenuFrame from "client/ui/components/menu-frame";
import { px } from "client/ui/utils/usePx";
import { BORDER_THICKNESS, COLORS } from "shared/configs/gui";
import { EquippableItemId, ItemId, items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";
import { selectPlayerItems } from "shared/store/selectors/players";

export default function InventoryApp() {
	const inventory = useSelector(selectPlayerItems(tostring(Players.LocalPlayer.UserId))) ?? [
		"emote_1",
		"hat_1",
		"case_1",
		"case_1",
		"case_2",
	];

	const groupedItems = new Map<string, { id: ItemId; quantity: number }[]>();
	for (const itemId of inventory ?? []) {
		const item = items.get(itemId);
		if (!item) continue;
		const itemType = itemId.split("_")[0];
		const group = groupedItems.get(itemType) ?? [];
		const existingItem = group.find((i) => i.id === itemId);
		if (existingItem) existingItem.quantity++;
		else group.push({ id: itemId, quantity: 1 });
		groupedItems.set(itemType, group);
	}
	const groupedItemsComponents: JSX.Element[] = [];
	groupedItems.forEach((itemMapObjects, itemType) => {
		const isCase = itemType === "case";
		groupedItemsComponents.push(
			<frame key={itemType} BackgroundTransparency={1} Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"}>
				<uipadding PaddingBottom={new UDim(0, px(15))} />
				<uilistlayout FillDirection={Enum.FillDirection.Vertical} />
				<textlabel
					Text={itemType.sub(1, 1).upper() + itemType.sub(2) + "s"}
					BackgroundTransparency={0}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextSize={px(36)}
					AutomaticSize="Y"
					TextColor3={COLORS.White}
					BorderSizePixel={0}
				>
					<uistroke Color={COLORS.Border} Thickness={px(BORDER_THICKNESS)} />
				</textlabel>
				<frame BackgroundTransparency={1} AutomaticSize="XY">
					<uigridlayout
						FillDirection={Enum.FillDirection.Horizontal}
						FillDirectionMaxCells={4}
						CellPadding={new UDim2(0, px(15), 0, px(15))}
						CellSize={new UDim2(0, px(150), 0, px(150))}
					/>
					{/* {itemIds.map((itemId) => (
						<ImageButton
							key={itemId}
							image={"rbxassetid://3926305904"}
							onClick={() => {
								store.setGuiPage(undefined);
								if (isCase) Functions.inventory.openCase(itemId as (typeof cases)[number]["id"]);
								else Functions.inventory.equip(itemId as EquippableItemId);
							}}
							toolTip={{
								header: items.get(itemId)?.name || "THIS SHOULDNT HAPPEN. PLEASE REPORT BUG TO DEVS",
								body: `Click To ${isCase ? "Open" : "Equip"}`,
							}}
						/>
					))} */}
					{itemMapObjects.map((itemMapObject) => {
						const item = items.get(itemMapObject.id);
						// show the quantity of the item on top of the image
						print(itemMapObject);
						return (
							<frame>
								<ImageButton
									key={itemMapObject.id}
									image={""}
									onClick={() => {
										store.setGuiPage(undefined);
										if (isCase)
											Functions.inventory.openCase(
												itemMapObject.id as (typeof cases)[number]["id"],
											);
										else Functions.inventory.equip(itemMapObject.id as EquippableItemId);
									}}
									toolTip={{
										header: item?.name || "THIS SHOULDNT HAPPEN. PLEASE REPORT BUG TO DEVS",
										body: `Click To ${isCase ? "Open" : "Equip"}`,
									}}
								/>
								{itemMapObject.quantity > 1 && (
									<textlabel
										Text={tostring(itemMapObject.quantity)}
										BackgroundTransparency={1}
										Position={new UDim2(0, px(5), 0, px(5))}
										AutomaticSize={"XY"}
										TextXAlignment={Enum.TextXAlignment.Right}
										TextYAlignment={Enum.TextYAlignment.Top}
										TextColor3={COLORS.White}
										TextSize={px(18)}
									/>
								)}
							</frame>
						);
					})}
				</frame>
			</frame>,
		);
	});

	return (
		<MenuFrame
			header={{
				icon: "rbxassetid://",
				title: "Inventory",
			}}
		>
			<uilistlayout FillDirection={Enum.FillDirection.Vertical} />
			{groupedItemsComponents}
		</MenuFrame>
	);
}
