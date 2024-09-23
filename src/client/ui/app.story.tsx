import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import ReactRoblox from "@rbxts/react-roblox";
import { store } from "client/store";
import App from "./apps/app";
import { usePx } from "./utils/usePx";

const controls = {};

const Story = {
	summary: "App",
	react: React,
	reactRoblox: ReactRoblox,
	story: () => {
		usePx();

		return (
			<ReflexProvider producer={store}>
				<App />
			</ReflexProvider>
		);
	},
};

export = Story;
