import React, { useEffect, useRef, useState } from "@rbxts/react";
import motion from "@rbxts/react-motion";
import { Events } from "client/network";
import { px } from "client/ui/utils/usePx";

function useCountdown() {
	const [message, setMessage] = useState("");
	const [hideState, setHideState] = useState(true);
	const hideRef = useRef(true);
	const messageQueue = useRef<string[]>([]);

	const setHide = (bool: boolean) => {
		setHideState(bool);
		hideRef.current = bool;
	};

	useEffect(() => {
		const conn = Events.announcer.countdown.connect(({ seconds, description }) => {});

		task.spawn(() => {
			while (true) {}
		});

		return () => conn.Disconnect();
	}, []);

	return [message, hideState];
}

export default function CountdownApp() {
	const [message, hide] = useCountdown();

	return <frame BackgroundTransparency={0} Size={UDim2.fromScale(1, 1)} Position={UDim2.fromOffset(0, 0)}></frame>;
}
