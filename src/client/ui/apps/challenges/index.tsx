import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectChallenge } from "shared/store/selectors/client";
import BoulderChallenge from "./boulder";

export default function ChallengesApp() {
	const challenge = useSelector(selectChallenge);

	function CurrentChallenge() {
		if (challenge === "Boulder") return <BoulderChallenge />;
		return <></>;
	}

	return <CurrentChallenge />;
}
