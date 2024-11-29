import React, { useEffect } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { useSelector } from "@rbxts/react-reflex";
import { UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { selectGuiPage, selectSpectating, selectToolTip } from "shared/store/selectors/client";
import AnimateEventsApp from "./animateEvents";
import AnnounceApp from "./announce";
import ChallengesApp from "./challenges";
import MenuButtonsApp from "./menu/buttons";
import AchievementsApp from "./menu/pages/achievements";
import ActionsPage from "./menu/pages/actions";
import InventoryApp from "./menu/pages/inventory";
import SettingsApp from "./menu/pages/settings";
import ShopApp from "./menu/pages/shop";
import TradingApp from "./menu/pages/trading";
import QueueApp from "./queue";
import SpectateApp from "./spectate";

export default function App() {
	const page = useSelector(selectGuiPage);

	function CurrentPage() {
		if (page === "Inventory") return <InventoryApp />;
		if (page === "Shop") return <ShopApp />;
		if (page === "Achievements") return <AchievementsApp />;
		if (page === "Trading") return <TradingApp />;
		if (page === "Settings") return <SettingsApp />;
		if (page === "Actions") return <ActionsPage />;
		return <></>;
	}

	const toolTip = useSelector(selectToolTip);
	const spectating = useSelector(selectSpectating);
	const [blackScreenActive, setBlackScreenActive] = React.useState(false);

	useEffect(() => {
		const connections = [Events.animations.setBlackFade.connect(setBlackScreenActive)];
		return () => {
			connections.forEach((c) => c.Disconnect());
		};
	}, []);

	useEffect(() => {
		if (spectating) setBlackScreenActive(false);
	}, [spectating]);

	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			<CurrentPage />
			<MenuButtonsApp />
			<AnnounceApp />
			<AnimateEventsApp />
			{spectating ? <SpectateApp /> : <ChallengesApp />}
			{toolTip && <ToolTip />}
			<QueueApp />
			<motion.frame
				transition={{ duration: 0.25 }}
				animate={{
					BackgroundTransparency: blackScreenActive ? 0 : 1,
				}}
				initial={{ BackgroundTransparency: 1 }}
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			/>
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
