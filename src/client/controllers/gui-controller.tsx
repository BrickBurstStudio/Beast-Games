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
		task.wait(3);

		usePx();
		const root = createRoot(new Instance("Folder"));
		root.render(
			createPortal(
				<screengui Enabled={true} ResetOnSpawn={false}>
					{/* <App /> */}
				</screengui>,
				this.playerGui,
			),
		);
	}
}
