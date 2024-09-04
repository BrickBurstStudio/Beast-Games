interface ServerStorage extends Instance {
	__Rojo_SessionLock: ObjectValue;
	RBX_ANIMSAVES: Model & {
		Rig: ObjectValue & {
			["Automatic Save"]: KeyframeSequence;
		};
	};
	ChallengeMaps: Folder & {
		BriefcaseChallenge: Folder;
		MoneyPileChallenge: Folder;
		BoulderChallenge: Folder;
		FlagChallenge: Folder;
	};
}
