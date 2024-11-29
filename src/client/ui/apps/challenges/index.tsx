import React, { useCallback, useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectChallenge } from "shared/store/selectors/client";
import BoulderChallenge from "./boulder";
import { BribeChallenge } from "./bribe";

export default function ChallengesApp() {
	const challenge = useSelector(selectChallenge);

	const CurrentChallenge = useCallback(() => {
		if (challenge === "Boulder Pull") return <BoulderChallenge />;
		if (challenge === "Bribe") return <BribeChallenge />;
		return <></>;
	}, [challenge]);

	return <CurrentChallenge />;
}
