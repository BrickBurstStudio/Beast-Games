import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players } from "@rbxts/services";
import { Functions } from "client/network";
import { store } from "client/store";
import ImageButton from "client/ui/components/image-button";
import MenuFrame from "client/ui/components/menu-frame";
import { px } from "client/ui/utils/usePx";
import { BORDER_THICKNESS, COLORS } from "shared/configs/gui";
import { ItemId, items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";
import { hats } from "shared/configs/items/hats";
import { selectPlayerEquipped, selectPlayerItems } from "shared/store/selectors/players";
import { BUTTONS } from "../buttons";

const inventoryButton = BUTTONS.find((button) => button.name === "Inventory")!;
export default function InventoryApp() {
	const inventory = useSelector(selectPlayerItems(tostring(Players.LocalPlayer.UserId)));
	const equippedItems = useSelector(selectPlayerEquipped(tostring(Players.LocalPlayer.UserId)));
	if (inventory === undefined || equippedItems === undefined) return <></>;

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
					{itemMapObjects.map((itemMapObject) => {
						const item = items.get(itemMapObject.id);
						const isEquipped = equippedItems.hat === itemMapObject.id;
						const isEmote = itemMapObject.id.split("_")[0] === "emote";
						return (
							<ImageButton
								key={itemMapObject.id}
								image={"rbxassetid://6031094678"}
								backgroundColor3={isEquipped ? COLORS.Buttons.On : undefined}
								onClick={() => {
									store.setGuiPage(undefined);
									if (isCase)
										return Functions.inventory.openCase(
											itemMapObject.id as (typeof cases)[number]["id"],
										);

									if (isEmote) {
										// Events.animationController.play(itemMapObject.id);
										return;
									}

									if (isEquipped)
										Functions.inventory.unequip(itemMapObject.id as (typeof hats)[number]["id"]);
									else Functions.inventory.equip(itemMapObject.id as (typeof hats)[number]["id"]);
								}}
								toolTip={{
									header: item?.name || "THIS SHOULDNT HAPPEN. PLEASE REPORT BUG TO DEVS",
									body: `Rarity: ${item?.rarity || "Common"}\n\nClick To ${
										isCase ? "Open" : isEmote ? "Use" : isEquipped ? "Unequip" : "Equip"
									}`,
								}}
								size={UDim2.fromScale(1, 1)}
							>
								<frame
									Size={UDim2.fromScale(1, 0.1)}
									Position={UDim2.fromScale(0, 0)}
									BackgroundColor3={getRarityColor(item?.rarity)}
									BackgroundTransparency={0.5}
								>
									<uicorner CornerRadius={new UDim(0, px(5))} />
								</frame>
								{itemMapObject.quantity > 1 && (
									<textlabel
										Text={tostring(itemMapObject.quantity)}
										BackgroundTransparency={1}
										Position={new UDim2(0, px(7.5), 0, px(7.5))}
										AutomaticSize={"XY"}
										TextXAlignment={Enum.TextXAlignment.Right}
										TextYAlignment={Enum.TextYAlignment.Top}
										TextColor3={COLORS.White}
										TextSize={px(18)}
									>
										<uistroke Color={COLORS.Border} Thickness={px(BORDER_THICKNESS * 0.75)} />
									</textlabel>
								)}
							</ImageButton>
						);
					})}
				</frame>
			</frame>,
		);
	});

	return (
		<MenuFrame
			header={{
				icon: inventoryButton.icon,
				title: inventoryButton.name,
			}}
		>
			<uilistlayout FillDirection={Enum.FillDirection.Vertical} />
			{groupedItemsComponents}
		</MenuFrame>
	);
}

function getRarityColor(rarity?: string) {
	switch (rarity?.lower()) {
		case "common":
			return Color3.fromRGB(150, 150, 150);
		case "uncommon":
			return Color3.fromRGB(0, 255, 0);
		case "rare":
			return Color3.fromRGB(0, 100, 255);
		case "epic":
			return Color3.fromRGB(170, 0, 255);
		case "legendary":
			return Color3.fromRGB(255, 215, 0);
		default:
			return Color3.fromRGB(150, 150, 150); // Default to common
	}
}
