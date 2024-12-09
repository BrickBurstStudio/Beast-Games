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
		(async () => {
			if (!viewportRef.current) return;
			// Clone the player's character for preview
			const playerCharacter = StarterPlayer.StarterCharacter.Clone();
			characterRef.current = playerCharacter;
			const worldModel = new Instance("WorldModel");
			worldModel.Parent = viewportRef.current;
			playerCharacter.Parent = worldModel;

			// Set up animator and play animation
			const animator = playerCharacter.Humanoid.Animator;

			const track = animator.LoadAnimation(emote.animation);
			track.Looped = true;
			track.Play();

			// Set up camera
			const camera = new Instance("Camera");
			camera.FieldOfView = 50;

			const humanoidRootPart = playerCharacter.HumanoidRootPart;

			camera.CFrame = new CFrame(humanoidRootPart.Position.add(new Vector3(0, 2, -6)), humanoidRootPart.Position);

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
