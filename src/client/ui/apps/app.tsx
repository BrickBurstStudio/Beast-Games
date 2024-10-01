import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { UserInputService } from "@rbxts/services";
import { selectGuiPage, selectToolTip } from "shared/store/selectors/client";
import AnnouncerApp from "./announcer";
import MenuButtonsApp from "./menu/buttons";
import AchievementsApp from "./menu/pages/achievements";
import InventoryApp from "./menu/pages/inventory";
import SettingsApp from "./menu/pages/settings";
import ShopApp from "./menu/pages/shop";
import TradingApp from "./menu/pages/trading";
import AnimateEventsApp from "./animateEvents";

export default function App() {
	const page = useSelector(selectGuiPage);

	function CurrentPage() {
		if (page === "Inventory") return <InventoryApp />;
		if (page === "Shop") return <ShopApp />;
		if (page === "Achievements") return <AchievementsApp />;
		if (page === "Trading") return <TradingApp />;
		if (page === "Settings") return <SettingsApp />;
		return <></>;
	}

	const toolTip = useSelector(selectToolTip);

	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			{/* <RhthymApp /> */}
			{/* <SprintApp /> */}
			<AnnouncerApp />
			<CurrentPage />
			<MenuButtonsApp />
			<AnimateEventsApp/>
			{toolTip && <ToolTip />}
		</frame>
	);
}

function ToolTip() {
	const toolTip = useSelector(selectToolTip);
	if (!toolTip) return <></>;
	const mouseLocation = UserInputService.GetMouseLocation();
	return (
		<textlabel
			ZIndex={100}
			AutomaticSize={Enum.AutomaticSize.XY}
			Position={new UDim2(0, mouseLocation.X, 0, mouseLocation.Y)}
			Text={`${toolTip.header}${toolTip.body ? "\n\n" + toolTip.body : ""}`}
			BackgroundTransparency={0.5}
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			TextColor3={Color3.fromRGB(255, 255, 255)}
		/>
	);
}
