import React from "@rbxts/react";
import { store } from "client/store";
import { COLORS } from "shared/configs/gui";
import { ToolTip } from "shared/store/slices/client/gui";
import { px } from "../utils/usePx";

type ImageButtonProps = {
	image?: string;
	onClick: (rbx: ImageButton) => void;
	position?: UDim2;
	size?: UDim2;
	anchorPoint?: Vector2;
	toolTip?: ToolTip;
	backgroundColor3?: Color3;
	children?: React.ReactNode;
};

export default function ImageButton(props: ImageButtonProps) {
	const { image, onClick, position, size, anchorPoint, backgroundColor3, children } = props;

	return (
		<imagebutton
			BackgroundColor3={backgroundColor3 ?? COLORS.Primary}
			BackgroundTransparency={0}
			Position={position}
			Size={size}
			AnchorPoint={anchorPoint}
			Event={{
				MouseButton1Click: (rbx) => {
					store.setToolTip(undefined);
					onClick(rbx);
				},
				MouseEnter: () => {
					store.setToolTip(props.toolTip);
				},
				MouseLeave: () => {
					store.setToolTip(undefined);
				},
			}}
		>
			{children}
			<uicorner CornerRadius={new UDim(0, px(10))} />
			<imagelabel
				Image={image}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.75, 0.75)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
			/>
		</imagebutton>
	);
}
