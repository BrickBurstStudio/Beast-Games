import React from "@rbxts/react";
import AnnouncerApp from "./announcer";
import AnnounceRules from "./rules";
import CountdownApp from "./countdown";

export default function AnnounceApp() {
	return (
		<>
			<AnnouncerApp />
			<AnnounceRules />
			<CountdownApp />
		</>
	);
}
