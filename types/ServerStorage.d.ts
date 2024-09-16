interface ServerStorage extends Instance {
	Assets: Folder & {
		Gui: Folder & {
			TitleBGUI: BillboardGui & {
				UIListLayout: UIListLayout;
				Frame: Frame & {
					UIListLayout: UIListLayout;
					Level: TextLabel;
					DisplayName: TextLabel;
				};
				Username: TextLabel;
				Honor: TextLabel;
			};
		};
	};
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
