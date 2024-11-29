interface ServerStorage extends Instance {
	__Rojo_SessionLock: ObjectValue;
	Assets: Folder & {
		Skybox: Folder & {
			Void: Sky;
		};
		Sounds: Folder & {
			MoneySFX: Sound;
		};
		Objects: Folder & {
			Platform: Model & {
				Union: UnionOperation;
				CharacterSpawn: Part;
				Lighting: Model & {
					Union: UnionOperation;
					Part: Part & {
						SpotLight: SpotLight;
					};
				};
				Door2: Part;
				Door1: Part;
				Barrier: UnionOperation;
			};
		};
		Gizmos: Folder & {
			Pugil: Tool & {
				Side1: UnionOperation;
				Base: UnionOperation;
				Side2: UnionOperation;
			};
			ExampleGizmo: Tool & {
				Base: Part;
			};
		};
		VFX: Folder & {
			MoneyVFX: ParticleEmitter;
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
			CircleBGUI: BillboardGui & {
				Frame: Frame & {
					UICorner: UICorner;
				};
			};
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
		GoldRushChallenge: Folder & {
			Claims: Model & {
				Highlight: Highlight;
			};
			Underglow: Model;
			Obby: Model;
			Spawns: Folder & {
				Part: Part;
			};
		};
		MoneyPileChallenge: Folder & {
			Platforms: Model;
		};
		PugilChallenge: Folder & {
			Lights: Model;
			Spawns: Folder & {
				Purple: Part;
				Yellow: Part;
				Orange: Part;
				Red: Part;
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
	RBX_ANIMSAVES: Model;
}
