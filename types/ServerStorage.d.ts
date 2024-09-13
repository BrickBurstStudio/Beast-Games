interface ServerStorage extends Instance {
	__Rojo_SessionLock: ObjectValue;
	ChallengeMaps: Folder & {
		BriefcaseChallenge: Folder;
		MoneyPileChallenge: Folder;
		BoulderChallenge: Folder;
		FlagChallenge: Folder;
	};
	RBX_ANIMSAVES: Model & {
		Rig: ObjectValue & {
			["Automatic Save"]: KeyframeSequence;
		};
	};
}
