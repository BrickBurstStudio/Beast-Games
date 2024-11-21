import React from "@rbxts/react";
import { store } from "client/store";
import { COLORS } from "shared/configs/gui";
import { ToolTip } from "shared/store/slices/client/gui";
import { px } from "../utils/usePx";

type ImageButtonProps = {
	image: string;
	onClick: (rbx: ImageButton) => void;
	position?: UDim2;
	size?: UDim2;
	anchorPoint?: Vector2;
	toolTip?: ToolTip;
};

export default function ImageButton(props: ImageButtonProps) {
	const { image, onClick, position, size, anchorPoint } = props;

	return (
		<imagebutton
			BackgroundColor3={COLORS.Primary}
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
			<uicorner CornerRadius={new UDim(0, px(10))} />
			<imagelabel
				Image={image}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.8, 0.8)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
			/>
		</imagebutton>
	);
}
