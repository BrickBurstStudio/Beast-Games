import React from "@rbxts/react";
import RhthymApp from "./rhthym/rhthym-app";
import { SprintApp } from "./sprint/sprint-app";

export default function App() {
	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			{/* <RhthymApp /> */}
			<SprintApp />
		</frame>
	);
}
