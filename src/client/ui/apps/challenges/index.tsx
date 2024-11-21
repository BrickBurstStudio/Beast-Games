import React, { useCallback, useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectChallenge } from "shared/store/selectors/client";
import BoulderChallenge from "./boulder";

export default function ChallengesApp() {
	const challenge = useSelector(selectChallenge);

	const CurrentChallenge = useCallback(() => {
		if (challenge === "Boulder") return <BoulderChallenge />;
		return <></>;
	}, [challenge]);

	return <CurrentChallenge />;
}
