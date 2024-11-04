import React, { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players, Workspace } from "@rbxts/services";
import { Currency } from "shared/configs/currency";
import { getLevel } from "shared/utils/functions/getLevel";
import Leaderboard from "./leaderboard";

export interface LeaderboardProps {
	name: string;
	datastoreName: "xp" | "wins" | "playTime" | Currency;
	leaderboardModel: Leaderboard;
	convertValue?: (value: number) => string | number;
}

const leaderboardsFolder = Workspace.WaitForChild("Leaderboards") as Leaderboards;

const LEADERBOARDS: LeaderboardProps[] = [
	{
		datastoreName: "playTime",
		name: "Play Time (Hours)",
		leaderboardModel: leaderboardsFolder.playTime,
		convertValue: (playTime) => {
			return string.format("%.2f", playTime / 3600);
		},
	},
	{
		datastoreName: "xp",
		name: "Level",
		leaderboardModel: leaderboardsFolder.xp,
		convertValue: (xp) => {
			return getLevel(xp);
		},
	},
	{
		datastoreName: "wins",
		name: "Wins",
		leaderboardModel: leaderboardsFolder.wins,
	},
	{
		datastoreName: "cash",
		name: "Cash",
		leaderboardModel: leaderboardsFolder.cash,
	},
];

export default function setupLeaderboards() {
	LEADERBOARDS.forEach((leaderboard) => {
		const leaderboardName = leaderboard.name || leaderboard.datastoreName;

		const leaderboardPart = leaderboard.leaderboardModel.Middle.Face;

		// TODO: make this a react component, like what we did with ScreenGui
		const leaderboardGui = new Instance("SurfaceGui", Players.LocalPlayer.WaitForChild("PlayerGui"));

		leaderboardGui.Name = leaderboardName;
		leaderboardGui.Adornee = leaderboardPart;
		leaderboardGui.Face = Enum.NormalId.Front;
		leaderboardGui.ResetOnSpawn = false;

		// FIX: find out why Adornee is changing
		leaderboardGui.GetPropertyChangedSignal("Adornee").Connect(() => {
			leaderboardGui.Adornee = leaderboardPart;
		});

		const root = createRoot(leaderboardGui);

		root.render(<StrictMode>{createPortal(<Leaderboard {...leaderboard} />, leaderboardGui)}</StrictMode>);
	});
}
