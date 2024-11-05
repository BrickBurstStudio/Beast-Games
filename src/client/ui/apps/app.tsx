import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players, UserInputService } from "@rbxts/services";
import { selectGuiPage, selectToolTip } from "shared/store/selectors/client";
import AnimateEventsApp from "./animateEvents";
import AnnouncerApp from "./announce/announcer";
import CountdownApp from "./announce/countdown";
import MenuButtonsApp from "./menu/buttons";
import AchievementsApp from "./menu/pages/achievements";
import InventoryApp from "./menu/pages/inventory";
import SettingsApp from "./menu/pages/settings";
import ShopApp from "./menu/pages/shop";
import TradingApp from "./menu/pages/trading";
import SpectateApp from "./spectate";
import ChallengesApp from "./challenges";
import AnnounceApp from "./announce";
import { Events } from "client/network";
import motion from "@rbxts/react-motion";

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

	const [eliminated, setEliminated] = React.useState(false);
	const [blackScreenActive, setBlackScreenActive] = React.useState(true);

	useEffect(() => {
		const player = Players.LocalPlayer;

		const connections = [
			player.GetAttributeChangedSignal("lives").Connect(() => {
				setEliminated(player.GetAttribute("lives") === 0);
			}),

			Events.animations.startChallenge.connect(() => {
				setBlackScreenActive(false);
			}),

			Events.animations.endChallenge.connect(() => {
				setBlackScreenActive(true);
			}),
		];
		return () => {
			connections.forEach((c) => c.Disconnect());
		};
	}, []);

	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			{/* <RhthymApp /> */}
			{/* <SprintApp /> */}
			<CurrentPage />
			<AnnounceApp />
			<MenuButtonsApp />
			<AnimateEventsApp />
			{eliminated ? <SpectateApp /> : <ChallengesApp />}
			{toolTip && <ToolTip />}
			<motion.frame
				transition={{ duration: 1 }}
				animate={{
					BackgroundTransparency: blackScreenActive ? 0 : 1,
				}}
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
