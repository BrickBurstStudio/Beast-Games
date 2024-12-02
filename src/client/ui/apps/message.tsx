import React, { useEffect } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { useSelector } from "@rbxts/react-reflex";
import { store } from "client/store";
import { selectMessage } from "shared/store/selectors/client";
import { px } from "../utils/usePx";

const COLORS = {
	error: Color3.fromRGB(255, 70, 70),
	success: Color3.fromRGB(70, 255, 70),
	info: Color3.fromRGB(70, 70, 255),
};

export function MessageApp() {
	const message = useSelector(selectMessage);

	useEffect(() => {
		if (message) {
			// Auto-hide message after 5 seconds
			const connection = task.delay(5, () => {
				store.setMessage(undefined);
			});
			return () => task.cancel(connection);
		}
	}, [message]);

	if (!message) return <></>;

	return (
		<motion.frame
			key={message.title} // Force re-render on new messages
            ZIndex={20}
			Size={new UDim2(0, px(500), 0, px(150))}
			Position={UDim2.fromScale(0.5, 0.1)}
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundColor3={COLORS[message.type]}
			transition={{ duration: 0.5, easingStyle: "Cubic", easingDirection: "InOut" }}
			initial={{ Position: UDim2.fromScale(0.5, -0.2) }}
			animate={{ Position: UDim2.fromScale(0.5, 0.1) }}
		>
			<uicorner CornerRadius={new UDim(0, px(8))} />
			<uilistlayout
				Padding={new UDim(0, px(8))}
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
			/>

			<textlabel
				Text={message.title}
				Size={UDim2.fromScale(0.9, 0.3)}
				BackgroundTransparency={1}
				TextColor3={new Color3(1, 1, 1)}
                ZIndex={21}
				TextScaled={true}
				FontFace={Font.fromName("GothamBold")}
			/>

			<textlabel
				Text={message.body}
				Size={UDim2.fromScale(0.9, 0.6)}
				BackgroundTransparency={1}
				TextColor3={new Color3(1, 1, 1)}
				ZIndex={21}
				TextScaled={true}
				FontFace={Font.fromName("Gotham")}
			/>
		</motion.frame>
	);
}
