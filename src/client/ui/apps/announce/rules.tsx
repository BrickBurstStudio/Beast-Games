import { motion } from "@rbxts/react-motion/out/motion";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";
import React, { useEffect, useState } from "react";
import { RULES_CONFIGS } from "shared/configs/announcer";
import { COLORS } from "shared/configs/gui";

const padding = 50;

export default function AnnounceRules() {
	const [rules, setRules] = useState<string[]>(["Default Rule 1", "Default Rule 2", "Default Rule 3"]);
	const [challengeName, setChallengeName] = useState("Default Title");

	const [hide, setHide] = useState(true);

	useEffect(() => {
		const conn = Events.announcer.announceRules.connect(({ challengeName, rules }) => {
			setRules(rules);
			setChallengeName(challengeName.upper());
			setHide(false);
			task.wait(rules.size() * RULES_CONFIGS.timePerRule + RULES_CONFIGS.timeAfterRules);
			setHide(true);
		});

		return () => conn.Disconnect();
	}, []);

	return (
		<motion.frame
			animate={{ Position: hide ? UDim2.fromScale(-1.5, 0.5) : UDim2.fromScale(0.5, 0.5) }}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.5, 0.7)}
			Position={UDim2.fromScale(-1.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			transition={{
				duration: RULES_CONFIGS.animationTime,
				easingStyle: Enum.EasingStyle.Cubic,
				easingDirection: Enum.EasingDirection.InOut,
			}}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				Padding={new UDim(0, px(25))}
			/>

			<textlabel
				Text={challengeName}
				Font={Enum.Font.SourceSansBold}
				TextColor3={COLORS.White}
				BackgroundTransparency={0}
				BackgroundColor3={COLORS.Primary}
				TextScaled
				RichText
				Size={new UDim2(1, 0, 0, px(75))}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />
			</textlabel>

			<frame Size={UDim2.fromScale(1, 1)}>
				<uicorner CornerRadius={new UDim(0.1, 0)} />
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, COLORS.Primary),
							new ColorSequenceKeypoint(1, COLORS.Secondary),
						])
					}
					Rotation={45}
				/>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0, px(10))}
				/>
				<uipadding
					PaddingLeft={new UDim(0, px(padding / 2))}
					PaddingRight={new UDim(0, px(padding / 2))}
					PaddingTop={new UDim(0, px(padding))}
					PaddingBottom={new UDim(0, px(padding))}
				/>
				{!hide &&
					rules.map((rule, i) => (
						<motion.textlabel
							Text={`<b>- ${rule}</b>`}
							TextColor3={COLORS.White}
							Font={"Jura"}
							BackgroundTransparency={1}
							BackgroundColor3={COLORS.Primary}
							TextWrapped={false}
							RichText
							Size={new UDim2(1, 0, 0, 50)}
							TextScaled
							initial={{ Transparency: 1 }}
							animate={{ Transparency: 0 }}
							transition={{
								duration: 1.5,
								delay: i * RULES_CONFIGS.timePerRule,
								easingStyle: Enum.EasingStyle.Cubic,
								easingDirection: Enum.EasingDirection.Out,
							}}
							BorderColor3={Color3.fromRGB(255, 255, 255)}
						>
							<uistroke Thickness={px(0)} Transparency={1} />
							<uicorner CornerRadius={new UDim(0.1, 0)} />
						</motion.textlabel>
					))}
			</frame>
		</motion.frame>
	);
}
