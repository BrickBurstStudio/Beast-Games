type ChallengeMaps = Folder & {
	BriefcaseChallenge: Folder & {
		Briefcases: Model;
		Baseplate: Part;
	};
	MoneyPileChallenge: Folder & {
		Money: Model & {
			Collision: Part;
		};
		Platforms: Model;
	};
	BoulderChallenge: Folder;
}
