interface ServerStorage extends Instance {
	__Rojo_SessionLock: ObjectValue;
	Assets: Folder & {
		Objects: Folder;
		VFX: Folder & {
			CashStack: MeshPart;
			LevelUp: Part & {
				Start: Attachment & {
					dragon: ParticleEmitter;
					smoke: ParticleEmitter;
					uinnershockwave: ParticleEmitter;
					impact: ParticleEmitter;
				};
				Weld: Weld;
				Sound: Sound;
			};
		};
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
		FlagChallenge: Folder & {
			ChallengeArea: Model & {
				StartArea: Model & {
					Barier: Part;
					Platform: Part;
				};
				EndArea: Model & {
					Barier: Part;
					Platform: Part;
				};
				Bariers: Model & {
					LeftBarier: Part;
					EndBarier: Part;
					StartBarier: Part;
					RightBarier: Part;
				};
				PlayArea: Part;
			};
		};
	};
	RBX_ANIMSAVES: Model & {
		Rig: ObjectValue & {
			["Automatic Save"]: KeyframeSequence;
		};
	};
}
