interface ServerStorage extends Instance {
	__Rojo_SessionLock: ObjectValue;
	Assets: Folder & {
		Gizmos: Folder & {
			ExampleGizmo: Tool & {
				Base: Part;
			};
		};
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
			Platforms: Model;
		};
		BoulderChallenge: Folder & {
			["1"]: Folder & {
				Rope: Part;
				Boulder: Part;
			};
			["0"]: Folder & {
				Rope: Part;
				Boulder: Part;
			};
			["3"]: Folder & {
				Boulder: Part;
				Rope: Part;
			};
			["2"]: Folder & {
				Boulder: Part;
				Rope: Part;
			};
			["4"]: Folder & {
				Rope: Part;
				Boulder: Part;
			};
		};
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
