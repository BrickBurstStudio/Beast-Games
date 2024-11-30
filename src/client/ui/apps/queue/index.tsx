import { Players } from "@rbxts/services";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";
import React, { useEffect, useState } from "react";
import { QUEUE_CONFIG } from "shared/configs/queue";

export default function QueueApp() {
	const [inQueue, setInQueue] = useState(false);
	const [playersInQueue, setPlayersInQueue] = useState(0);
	const MIN_PLAYERS = QUEUE_CONFIG.MIN_PLAYERS;

	useEffect(() => {
		const player = Players.LocalPlayer;

		// Initial check
		setInQueue(!!player.GetAttribute("inQueue"));

		// Listen for changes
		const connections = [
			player.AttributeChanged.Connect((attribute) => {
				if (attribute === "inQueue") {
					setInQueue(!!player.GetAttribute("inQueue"));
				}
			}),

			// Listen for queue updates
			Events.updateQueue.connect((count) => {
				setPlayersInQueue(count);
			}),
		];

		return () => connections.forEach((conn) => conn.Disconnect());
	}, []);

	if (!inQueue) return <></>;

	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			<textbutton
				Text="EXIT"
				Size={UDim2.fromOffset(px(400), px(100))}
				Position={UDim2.fromScale(0.5, 0.7)}
				AnchorPoint={new Vector2(0.5, 0)}
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

			<textlabel
				Text={`Players in queue: ${playersInQueue}/${QUEUE_CONFIG.MAX_PLAYERS}`}
				Size={UDim2.fromOffset(px(400), px(50))}
				Position={UDim2.fromScale(0.5, 0.6)}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				Font={"Jura"}
			/>

			{playersInQueue < MIN_PLAYERS && (
				<textlabel
					Text={`Waiting for minimum of ${MIN_PLAYERS} players ...`}
					Size={UDim2.fromOffset(px(1000), px(50))}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={"Jura"}
				/>
			)}
		</frame>
	);
}
