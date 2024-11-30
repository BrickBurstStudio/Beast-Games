import React, { useCallback, useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectChallenge } from "shared/store/selectors/client";
import BoulderChallenge from "./boulder";
import { BribeChallenge } from "./bribe";
import { SplitOrStealChallenge } from "./split-or-steal";

export default function ChallengesApp() {
	const challenge = useSelector(selectChallenge);

	const CurrentChallenge = useCallback(() => {
		if (challenge === "Boulder Pull") return <BoulderChallenge />;
		if (challenge === "Bribe") return <BribeChallenge />;
		if (challenge === "Split or Steal") return <SplitOrStealChallenge />;
		return <></>;
	}, [challenge]);

	return <CurrentChallenge />;
}
