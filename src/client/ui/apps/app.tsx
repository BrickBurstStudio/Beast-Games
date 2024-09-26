import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { selectGuiPage, selectToolTip } from "shared/store/selectors/client";
import AnnouncerApp from "./announcer";
import MenuButtons from "./menu/buttons";
import AchievementsApp from "./menu/pages/achievements";
import InventoryApp from "./menu/pages/inventory";
import SettingsApp from "./menu/pages/settings";
import ShopApp from "./menu/pages/shop";
import TradingApp from "./menu/pages/trading";
import CountdownApp from "./countdown";

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

	useEffect(() => {
		const connection = Events.levelUpPlayer.connect((level: number) => {
			print(`Level up to ${level}`);
		});

		return () => {
			connection.Disconnect();
		};
	}, []);

	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			{/* <RhthymApp /> */}
			{/* <SprintApp /> */}
			{/* <AnnouncerApp />
			<CurrentPage />
			<MenuButtons /> */}
			<CountdownApp />
			{/* {toolTip && <ToolTip />} */}
			{/* {<CountdownApp></CountdownApp>} */}
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
