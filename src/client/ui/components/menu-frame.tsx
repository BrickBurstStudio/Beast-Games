import React from "@rbxts/react";
import { store } from "client/store";
import { px } from "../utils/usePx";

type MenuFrameProps = {
	square?: boolean;
	title: string;
};

const headerElementSize = 125;

export default function MenuFrame(props: MenuFrameProps) {
	return (
		<frame
			Size={new UDim2(props.square ? 0.5 : 0.75, 0, 0.75, 0)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
		>
			<>
				{/* Icon */}
				<imagebutton
					Size={UDim2.fromOffset(px(headerElementSize), px(headerElementSize))}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 0, 0)}
					Image="rbxassetid://3926307971"
					BorderSizePixel={0}
					Event={{
						MouseButton1Click: () => {
							print("icon clicked");
						},
					}}
				/>
				{/* title */}
				<textlabel
					Text={props.title}
					Size={new UDim2(1, px(-headerElementSize), 0, px(headerElementSize * 0.75))}
					Position={new UDim2(0.5, 0, 0, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					// BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				/>
				{/* x button */}
				<imagebutton
					Size={UDim2.fromOffset(px(headerElementSize), px(headerElementSize))}
					Position={new UDim2(1, 0, 0, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 0, 0)}
					Image="rbxassetid://3926305904"
					BorderSizePixel={0}
					Event={{
						MouseButton1Click: () => {
							store.setGuiPage(undefined);
						},
					}}
				/>
			</>
		</frame>
	);
}
