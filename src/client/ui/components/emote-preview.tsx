import React, { useEffect, useRef } from "@rbxts/react";
import { StarterPlayer } from "@rbxts/services";
import { Emote } from "shared/configs/items/emotes";
import { px } from "../utils/usePx";

interface EmotePreviewProps {
	emote: Emote;
	size?: UDim2;
	position?: UDim2;
	anchorPoint?: Vector2;
}

export default function EmotePreview({ emote, size, position, anchorPoint }: EmotePreviewProps) {
	const viewportRef = useRef<ViewportFrame>();
	const characterRef = useRef<Model>();

	useEffect(() => {
		if (!viewportRef.current) return;
		(async () => {
			if (!viewportRef.current) return;
			// Clone the player's character for preview
			const model = StarterPlayer.StarterCharacter.Clone();
			characterRef.current = model;
			model.Parent = viewportRef.current;

			// Set up animator and play animation
			const animator = model.Humanoid.Animator;

			const track = animator.LoadAnimation(emote.animation);
			track.Play();

			// Set up camera
			const camera = new Instance("Camera");
			camera.FieldOfView = 90;

			const humanoidRootPart = model.FindFirstChild("HumanoidRootPart") as BasePart;
			if (humanoidRootPart) {
				camera.CFrame = new CFrame(
					humanoidRootPart.Position.add(new Vector3(0, 0, -3)),
					humanoidRootPart.Position,
				);
			}

			viewportRef.current.CurrentCamera = camera;
			camera.Parent = viewportRef.current;
		})();

		return () => {
			if (characterRef.current) {
				characterRef.current.Destroy();
			}
		};
	}, [emote]);

	return (
		<viewportframe
			ref={viewportRef}
			Size={size ?? UDim2.fromOffset(px(200), px(200))}
			Position={position}
			AnchorPoint={anchorPoint}
			BackgroundTransparency={1}
		/>
	);
}
