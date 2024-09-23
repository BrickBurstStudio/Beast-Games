import React, { useState } from "@rbxts/react";
import { store } from "client/store";

type ImageButtonProps = {
	image: string;
	onClick: Callback;
	position?: UDim2;
	size?: UDim2;
	anchorPoint?: Vector2;
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
					store.setToolTip({
						header: "Test",
						body: "This is a test",
					});
				},
				MouseLeave: () => {
					store.setToolTip(undefined);
				},
			}}
		/>
	);
}
