import React from "@rbxts/react";
import { px } from "client/ui/utils/usePx";

interface ModalProps {
	title: string;
	children: React.ReactNode;
	onClose: () => void;
	width?: number;
	height?: number;
}

export default function Modal({ title, children, onClose, width = 400, height = 500 }: ModalProps) {
	return (
		<frame
			BackgroundColor3={new Color3(0, 0, 0)}
			BackgroundTransparency={0.5}
			Size={UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
		>
			<frame
				BackgroundColor3={new Color3(0.15, 0.15, 0.15)}
				Size={UDim2.fromOffset(px(width), px(height))}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
			>
				<uicorner CornerRadius={new UDim(0, 8)} />

				{/* Title at top */}
				<textlabel
					Text={title}
					TextColor3={new Color3(1, 1, 1)}
					FontFace={Font.fromName("GothamBold")}
					TextSize={24}
					Size={new UDim2(1, 0, 0, px(50))}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0, 0)}
					AnchorPoint={new Vector2(0, 0)}
				/>

				{/* X Button */}
				<imagebutton
					Image="rbxassetid://6031094678"
					Size={UDim2.fromOffset(px(60), px(60))}
					Position={new UDim2(1, -px(30), 0, px(30))}
					AnchorPoint={new Vector2(0, 1)}
					BackgroundColor3={new Color3(1, 0, 0)}
					BackgroundTransparency={0}
					Event={{
						MouseButton1Click: onClose,
						MouseButton2Click: onClose,
					}}
				>
					<uicorner CornerRadius={new UDim(0, 8)} />
					<imagelabel
						Image="rbxassetid://6031094678"
						Size={UDim2.fromScale(0.6, 0.6)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
					/>
				</imagebutton>

				{/* Content container */}
				<frame Size={new UDim2(1, 0, 1, -px(50))} Position={UDim2.fromScale(0, 0.1)} BackgroundTransparency={1}>
					<uilistlayout
						Padding={new UDim(0, px(8))}
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					/>
					{children}
				</frame>
			</frame>
		</frame>
	);
}
