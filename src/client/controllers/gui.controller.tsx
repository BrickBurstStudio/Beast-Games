import { Controller, OnStart } from "@flamework/core";
import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { store } from "client/store";
import App from "client/ui/apps/app";
import setupLeaderboards from "client/ui/apps/leaderboards";
import { usePx } from "client/ui/utils/usePx";
import { selectPlayerData } from "shared/store/selectors/players";

@Controller()
export class GuiController implements OnStart {
	private playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");

	onStart() {
		store.once(selectPlayerData(tostring(Players.LocalPlayer.UserId)), () => {
			usePx();
			const root = createRoot(new Instance("Folder"));
			root.render(
				createPortal(
					<ReflexProvider producer={store}>
						<screengui Enabled={true} ResetOnSpawn={false} IgnoreGuiInset>
							<App />
						</screengui>
					</ReflexProvider>,
					this.playerGui,
				),
			);

			setupLeaderboards();
		});
	}
}
