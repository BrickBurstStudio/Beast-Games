import React, { useEffect, useState } from "react";
import { Players } from "@rbxts/services";
import { Events } from "client/network";

export default function QueueApp() {
	const [inQueue, setInQueue] = useState(false);

	useEffect(() => {
		const player = Players.LocalPlayer;
		
		// Initial check
		setInQueue(!!player.GetAttribute("inQueue"));
		
		// Listen for changes
		const conn = player.AttributeChanged.Connect((attribute) => {
			if (attribute === "inQueue") {
				setInQueue(!!player.GetAttribute("inQueue"));
			}
		});

		return () => conn.Disconnect();
	}, []);

	if (!inQueue) return <></>;

	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			<textbutton
				Text="EXIT"
				Size={UDim2.fromOffset(400, 100)}
				Position={UDim2.fromScale(0.5, 0.95)}
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundColor3={Color3.fromRGB(232, 70, 70)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				Font={"Jura"}
				Event={{
					MouseButton1Click: () => {
						Events.exitQueue.fire();
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0.25, 0)} />
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Thickness={4}
					Color={Color3.fromHSV(0, 0, 0.2)}
				/>
			</textbutton>
		</frame>
	);
}