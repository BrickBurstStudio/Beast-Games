import { Dependency } from "@flamework/core";
import React, { useEffect, useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { MovementController } from "client/controllers/movement-controller";
import { px } from "client/ui/utils/usePx";

// todo : implement sprint value into root state
export function SprintApp() {
	const [stamina, setStamina] = useState<number>(100);

	useEffect(() => {
		MovementController.staminaEvent.Event.Connect(setStamina);
	}, []);

	return (
		<frame
			BackgroundTransparency={0}
			Size={UDim2.fromOffset(px(50), px(300))}
			Position={UDim2.fromOffset(px(150), px(300))}
		>
			<uicorner CornerRadius={new UDim(1, 0)} />
			<motion.frame
				animate={{
					Size: UDim2.fromScale(1, stamina / 100),
					Position: UDim2.fromScale(0, 1 - stamina / 100),
				}}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={0.25}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				transition={{
					duration: 0.2,
					easingStyle: Enum.EasingStyle.Linear,
				}}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />
			</motion.frame>
		</frame>
	);
}
