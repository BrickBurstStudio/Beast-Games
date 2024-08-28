import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from "@rbxts/react";
import { px } from "client/ui/utils/usePx";
import { UserInputService } from "@rbxts/services";
import motion from "@rbxts/react-motion";
import { Janitor } from "@rbxts/janitor";

type KeyCodes = Record<string, "active" | "inactive">;
const KeyCodeContext = createContext<KeyCodes | undefined>(undefined);

function useKeyboardState() {
	const [keyCodes, setKeyCodes] = useState({});

	useEffect(() => {
		const obliterator = new Janitor();

		const handleInputBegan = (input: InputObject, gp: boolean) => {
			if (input.UserInputType !== Enum.UserInputType.Keyboard) return;
			setKeyCodes((prev) => ({ ...prev, [input.KeyCode.Name]: "active" }));
		};

		const handleInputEnded = (input: InputObject, gp: boolean) => {
			if (input.UserInputType !== Enum.UserInputType.Keyboard) return;
			setKeyCodes((prev) => ({ ...prev, [input.KeyCode.Name]: "inactive" }));
		};

		obliterator.Add(UserInputService.InputBegan.Connect(handleInputBegan), "Disconnect");
		obliterator.Add(UserInputService.InputEnded.Connect(handleInputEnded), "Disconnect");
		return () => obliterator.Cleanup();
	}, []);

	return keyCodes;
}

export default function RhthymApp() {
	const keyCodes = useKeyboardState();

	return (
		<>
			<frame
				Size={new UDim2(1, 0, 0, px(200))}
				BackgroundTransparency={0.5}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0)}
			>
				<uilistlayout
					FillDirection={"Horizontal"}
					Padding={new UDim(0, px(100))}
					VerticalAlignment={"Center"}
					HorizontalAlignment={"Center"}
				/>

				<KeyCodeContext.Provider value={keyCodes}>
					<KeyCircle keyCode={Enum.KeyCode.A} color={Color3.fromRGB(217, 79, 79)} />
					<KeyCircle keyCode={Enum.KeyCode.S} color={Color3.fromRGB(204, 186, 79)} />
					<KeyCircle keyCode={Enum.KeyCode.K} color={Color3.fromRGB(79, 204, 82)} />
					<KeyCircle keyCode={Enum.KeyCode.L} color={Color3.fromRGB(89, 79, 204)} />
				</KeyCodeContext.Provider>
			</frame>
		</>
	);
}

function KeyCircle({ keyCode, color }: { keyCode: Enum.KeyCode; color: Color3 }) {
	const keyCodes = useContext(KeyCodeContext);
	if (keyCodes === undefined) return;

	return (
		<motion.frame
			animate={keyCodes[keyCode.Name] ?? "inactive"}
			initial={"inactive"}
			Size={UDim2.fromOffset(px(100), px(100))}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={3}
			BackgroundColor3={color}
			transition={{ duration: 0.1, easingStyle: "Cubic" }}
			variants={{
				active: {
					Size: UDim2.fromOffset(px(120), px(120)),
					BackgroundColor3: Color3.fromRGB(255, 255, 255),
				},
				inactive: {
					Size: UDim2.fromOffset(px(100), px(100)),
					BackgroundColor3: color,
				},
			}}
		>
			<uicorner CornerRadius={new UDim(1, 0)} />
			<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={px(6)} />
			<textbutton
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				Text={keyCode.Name}
				TextSize={px(80)}
				TextColor3={Color3.fromRGB(0, 0, 0)}
				Font={"ArialBold"}
			/>
		</motion.frame>
	);
}
