import React, { useEffect, useState } from "@rbxts/react";
import { Players, UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

interface FlagPlacementState {
	currentFlagIndex: number;
	totalFlags: number;
	isPlacementPhase: boolean;
}

export function FlagMemoryChallenge() {
	const [state, setState] = useState<FlagPlacementState>({
		currentFlagIndex: 0,
		totalFlags: 3,
		isPlacementPhase: false,
	});

	useEffect(() => {
		const connections = [
			// Listen for when placement phase starts
			Events.challenges.flagMemoryChallenge.startPlacement.connect(() => {
				setState({ ...state, isPlacementPhase: true });
			}),

			// Listen for when placement phase ends
			Events.challenges.flagMemoryChallenge.endPlacement.connect(() => {
				setState({ ...state, isPlacementPhase: false });
			}),

			// Handle flag placement
			UserInputService.InputBegan.Connect((input, gameProcessed) => {
				if (gameProcessed || !state.isPlacementPhase) return;
				if (input.UserInputType === Enum.UserInputType.MouseButton1) {
					const mouse = Players.LocalPlayer.GetMouse();
					const hitPosition = mouse.Hit.Position;
					const hitRotation = math.deg(mouse.Hit.LookVector.Y);

					Events.challenges.flagMemoryChallenge.placeFlag.fire(
						state.currentFlagIndex,
						hitPosition,
						hitRotation,
					);

					if (state.currentFlagIndex < state.totalFlags - 1) {
						setState({ ...state, currentFlagIndex: state.currentFlagIndex + 1 });
					}
				}
			}),
		];

		return () => connections.forEach((conn) => conn.Disconnect());
	}, [state]);

	if (!state.isPlacementPhase) return <></>;

	return (
		<frame BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
			{/* Instructions */}
			<textlabel
				Text={`Place Flag ${state.currentFlagIndex + 1}/${state.totalFlags}`}
				Size={new UDim2(0, px(400), 0, px(50))}
				Position={UDim2.fromScale(0.5, 0.1)}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Font={Enum.Font.SourceSansBold}
				TextScaled={true}
			/>

			{/* Placement Instructions */}
			<textlabel
				Text="Click anywhere to place your flag!"
				Size={new UDim2(0, px(600), 0, px(40))}
				Position={UDim2.fromScale(0.5, 0.15)}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				TextColor3={Color3.fromRGB(200, 200, 200)}
				Font={Enum.Font.SourceSans}
				TextScaled={true}
			/>

			{/* Progress Indicator */}
			<frame
				Size={new UDim2(0, px(300), 0, px(10))}
				Position={UDim2.fromScale(0.5, 0.2)}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={Color3.fromRGB(50, 50, 50)}
			>
				<uicorner CornerRadius={new UDim(0.5, 0)} />
			</frame>
		</frame>
	);
}
