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
			BlockTower: Model & {
				Hitbox: Part;
			};
			Platform: Model & {
				Union: UnionOperation;
				Door1: Part;
				Lighting: Model & {
					Union: UnionOperation;
					Part: Part & {
						SpotLight: SpotLight;
					};
				};
				Door2: Part;
				CharacterSpawn: Part & {
					Sound: Sound;
				};
				Barrier: UnionOperation;
			};
			Ball: Part;
		};
		Gizmos: Folder & {
			ExampleGizmo: Tool & {
				Base: Part;
			};
			Push: Tool;
			Pugil: Tool & {
				Side1: UnionOperation;
				Base: UnionOperation;
				Side2: UnionOperation;
			};
			Ball: Tool & {
				Handle: Part;
				bruh: Part;
			};
			Tower: Tool & {
				Union: UnionOperation;
				Handle: Part;
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
		KingOfTheHillChallenge: Folder & {
			Hill: Model & {
				Top: Part;
				MainSpawn: Part;
			};
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
		_oldKingOfTheHillChallenge: Folder & {
			Hill: Model & {
				Base: Part;
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
