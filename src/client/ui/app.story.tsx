import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { usePx } from "./utils/usePx";
import App from "./apps/app";

const controls = {};

const Story = {
	summary: "App",
	react: React,
	reactRoblox: ReactRoblox,
	story: () => {
		// todo : remove comment below
		// eslint-disable-next-line roblox-ts/no-any, @typescript-eslint/no-unsafe-call
		usePx();
		return <App />;
	},
};

export = Story;
