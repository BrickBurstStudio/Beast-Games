import React, { useState } from "@rbxts/react";
import { store } from "client/store";
import { ToolTip } from "shared/store/slices/client/gui";

type ImageButtonProps = {
	image: string;
	onClick: Callback;
	position?: UDim2;
	size?: UDim2;
	anchorPoint?: Vector2;
	toolTip?: ToolTip;
};

export default function ImageButton(props: ImageButtonProps) {
	const { image, onClick, position, size, anchorPoint } = props;

	return (
		<imagebutton
			// BackgroundTransparency={1}
			Image={image}
			ImageTransparency={0}
			Position={position}
			Size={size}
			AnchorPoint={anchorPoint}
			Event={{
				MouseButton1Click: onClick,
				MouseEnter: () => {
					store.setToolTip(props.toolTip);
				},
				MouseLeave: () => {
					store.setToolTip(undefined);
				},
			}}
		/>
	);
}
