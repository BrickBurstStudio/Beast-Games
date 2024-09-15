import React, { useEffect } from "@rbxts/react";
import RhthymApp from "./rhthym/rhthym-app";
import { SprintApp } from "./sprint/sprint-app";
import { Events } from "client/network";

export default function App() {
	useEffect(()=>{
		Events.levelUpPlayer.connect((level: number) => {
			print(`Level up to ${level}`);
		});
	},[])
	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			{/* <RhthymApp /> */}
			<SprintApp />
		</frame>
	);
}
