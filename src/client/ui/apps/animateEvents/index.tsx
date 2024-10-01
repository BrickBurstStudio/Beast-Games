import React, { useEffect } from "@rbxts/react";
import { Events } from "client/network";

export default function AnimateEventsApp() {
	useEffect(() => {
		const connections = [
			Events.animations.levelUp.connect((level: number) => {
				print(`Level up to ${level}`);
			}),
		];

		return () => {
			connections.forEach((c) => c.Disconnect());
		};
	}, []);
	return <></>;
}
