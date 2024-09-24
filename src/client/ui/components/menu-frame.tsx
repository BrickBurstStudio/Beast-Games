import React, { ReactNode } from "@rbxts/react";
import { store } from "client/store";
import { BORDER_THICKNESS, COLORS } from "shared/configs/gui";
import { px } from "../utils/usePx";

type MenuFrameProps = {
	square?: boolean;
	children?: ReactNode;
	header: {
		icon: string;
		title: string;
	};
};

const headerElementSize = 100;

export default function MenuFrame(props: MenuFrameProps) {
	return (
		<frame
			Size={new UDim2(0.7, 0, 0.6, 0)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			BackgroundColor3={Color3.fromHSV(0, 0, 1)}
		>
			<uicorner CornerRadius={new UDim(0, px(10))} />
			<uistroke Color={COLORS.Border} Thickness={px(BORDER_THICKNESS)} />
			<uiaspectratioconstraint AspectRatio={props.square ? 1 : 2} DominantAxis={Enum.DominantAxis.Height} />

			<frame Size={UDim2.fromScale(1, 0)} ZIndex={2} BackgroundTransparency={1}>
				{/* title */}
				<textlabel
					Text={props.header.title}
					Size={new UDim2(1, px(headerElementSize), 0, px(headerElementSize * 0.75))}
					Position={new UDim2(0.5, 0, 0, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<uistroke Color={COLORS.Border} Thickness={px(BORDER_THICKNESS)} />
				</textlabel>
				{/* x button */}
				<imagebutton
					Size={UDim2.fromOffset(px(headerElementSize), px(headerElementSize))}
					Position={new UDim2(1, 0, 0, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 0, 0)}
					Image="rbxassetid://"
					BorderSizePixel={0}
					Event={{
						MouseButton1Click: () => {
							store.setGuiPage(undefined);
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0, px(10))} />
				</imagebutton>
			</frame>
			<scrollingframe BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
				<uipadding
					PaddingTop={new UDim(0, px(headerElementSize))}
					PaddingRight={new UDim(0, px(headerElementSize))}
					PaddingBottom={new UDim(0, px(headerElementSize))}
					PaddingLeft={new UDim(0, px(headerElementSize))}
				/>
				{props.children}
			</scrollingframe>
		</frame>
	);
}
