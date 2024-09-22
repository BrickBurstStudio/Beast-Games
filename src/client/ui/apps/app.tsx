import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Events } from "client/network";
import { selectGuiPage } from "shared/store/selectors/client";
import AnnouncerApp from "./announcer";

import AchievementsApp from "./menu/achievements";
import MenuButtons from "./menu/buttons";
import InventoryApp from "./menu/inventory";
import SettingsApp from "./menu/settings";
import ShopApp from "./menu/shop";
import TradingApp from "./menu/trading";

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

	useEffect(() => {
		Events.levelUpPlayer.connect((level: number) => {
			print(`Level up to ${level}`);
		});
	}, []);
	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			{/* <RhthymApp /> */}
			{/* <SprintApp /> */}
			<AnnouncerApp />
			<CurrentPage />
			<MenuButtons />
		</frame>
	);
}
