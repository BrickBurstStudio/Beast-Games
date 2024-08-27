import React from "@rbxts/react";
import RhthymApp from "./rhthym/rhthym-app";

export default function App() {
	return (
		<frame BackgroundTransparency={0.5} Size={UDim2.fromScale(1, 1)}>
			<RhthymApp />
		</frame>
	);
}
