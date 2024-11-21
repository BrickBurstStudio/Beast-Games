import React, { ReactNode } from "@rbxts/react";
import { store } from "client/store";
import { BORDER_THICKNESS, COLORS } from "shared/configs/gui";
import { px } from "../utils/usePx";
import ImageButton from "./image-button";

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

			<frame Size={UDim2.fromScale(1, 0)} ZIndex={10} BackgroundTransparency={1}>
				{/* title container */}
				<frame
					Size={new UDim2(1, px(headerElementSize), 0, px(headerElementSize * 0.75))}
					Position={new UDim2(0.5, 0, 0, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
				>
					{/* icon */}
					<frame
						Size={UDim2.fromOffset(px(headerElementSize * 0.75), px(headerElementSize * 0.75))}
						Position={UDim2.fromScale(0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						BackgroundColor3={COLORS.Primary}
					>
						<uistroke Color={COLORS.Border} Thickness={px(BORDER_THICKNESS)} />
						<uicorner CornerRadius={new UDim(0, px(10))} />
						<uipadding
							PaddingTop={new UDim(0, px(10))}
							PaddingBottom={new UDim(0, px(10))}
							PaddingLeft={new UDim(0, px(10))}
							PaddingRight={new UDim(0, px(10))}
						/>
						<imagelabel
							Image={props.header.icon}
							ImageColor3={COLORS.White}
							Size={UDim2.fromScale(1, 1)}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0, 0)}
						/>
					</frame>
					{/* title */}
					<textlabel
						Text={props.header.title}
						Size={UDim2.fromScale(0.9, 1)}
						Position={UDim2.fromScale(0.1, 0)}
						TextScaled={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<uistroke Color={COLORS.Border} Thickness={px(BORDER_THICKNESS)} />
					</textlabel>
				</frame>
				{/* x button */}
				<ImageButton
					backgroundColor3={Color3.fromRGB(255, 0, 0)}
					size={UDim2.fromOffset(px(headerElementSize), px(headerElementSize))}
					position={new UDim2(1, 0, 0, 0)}
					anchorPoint={new Vector2(0.5, 0.5)}
					image="rbxassetid://6031094678"
					onClick={() => {
						store.setGuiPage(undefined);
					}}
				/>
			</frame>
			<scrollingframe
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				CanvasSize={UDim2.fromScale(0, 0)}
				AutomaticCanvasSize={"Y"}
				ScrollBarImageColor3={Color3.fromRGB(0, 0, 0)}
			>
				<uipadding
					PaddingTop={new UDim(0, px(headerElementSize / 2))}
					PaddingBottom={new UDim(0, px(headerElementSize / 2))}
					PaddingRight={new UDim(0, px(headerElementSize / 2))}
					PaddingLeft={new UDim(0, px(headerElementSize / 2))}
				/>
				{props.children}
			</scrollingframe>
		</frame>
	);
}
