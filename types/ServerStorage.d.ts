interface ServerStorage extends Instance {
	__Rojo_SessionLock: ObjectValue;
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
	RBX_ANIMSAVES: Model & {
		Rig: ObjectValue & {
			["Automatic Save"]: KeyframeSequence;
		};
	};
	ChallengeMaps: Folder & {
		BriefcaseChallenge: Folder;
		MoneyPileChallenge: Folder;
		BoulderChallenge: Folder;
		FlagChallenge: Folder & {
			Baseplate: Part;
			StartingLine: Part;
		};
	};
}
