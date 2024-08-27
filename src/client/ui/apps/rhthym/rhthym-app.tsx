import React, { createContext, useContext, useEffect, useState } from "@rbxts/react";
import { px } from "client/ui/utils/usePx";
import { UserInputService } from "@rbxts/services";

const KeyCodeContext = createContext<Enum.KeyCode | undefined>(undefined);

export default function RhthymApp() {
	const [keyCode, setKeyCode] = useState<Enum.KeyCode | undefined>();

	useEffect(() => {
		UserInputService.InputBegan.Connect((input) => {
			setKeyCode(input.KeyCode);
		});
	}, []);

	return (
		<>
			<frame
				AutomaticSize={"XY"}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
			>
				<uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0.25, 0)} />

				<KeyCodeContext.Provider value={keyCode}>
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
	const pressedKeyCode = useContext(KeyCodeContext);
	print(pressedKeyCode, pressedKeyCode === keyCode);

	return (
		<frame
			Size={UDim2.fromOffset(px(100), px(100))}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={3}
			BackgroundColor3={color}
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
		</frame>
	);
}
