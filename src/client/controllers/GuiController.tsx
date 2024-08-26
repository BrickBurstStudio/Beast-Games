import { Controller, OnStart } from "@flamework/core";
import React from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players, StarterGui } from "@rbxts/services";
import App from "client/ui/apps/app";
import { usePx } from "client/ui/utils/usePx";

@Controller()
export class GuiController implements OnStart {
	private playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");

	onStart() {
		usePx();

		const root = createRoot(new Instance("Folder"));
		root.render(
			createPortal(
				<screengui Enabled={true} ResetOnSpawn={false}>
					<uiscale Scale={1} />

					<App />
				</screengui>,
				this.playerGui,
			),
		);
	}
}
