import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import ReactRoblox from "@rbxts/react-roblox";
import { store } from "client/store";
import { defaultPlayerData } from "shared/store/slices/players/utils";
import App from "./apps/app";
import { usePx } from "./utils/usePx";

const controls = {};

const Story = {
	summary: "App",
	react: React,
	controls,
	reactRoblox: ReactRoblox,
	story: () => {
		usePx();
		store.loadPlayerData("test", defaultPlayerData);
		store.addItemToInventory("test", "case_1");
		store.addItemToInventory("test", "case_2");
		return (
			<ReflexProvider producer={store}>
				<App />
			</ReflexProvider>
			// <frame Size={UDim2.fromScale(1, 1)} Position={UDim2.fromOffset(0, 0)} BackgroundTransparency={.5}></frame>
		);
	},
};

export = Story;
