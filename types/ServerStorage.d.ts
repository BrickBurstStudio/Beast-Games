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
			Glock: Tool & {
				Flame: Part & {
					Fire: Sound;
				};
				SightMark: Part;
				Mag: UnionOperation;
				FirePart: Part & {
					["FlashFX3[Front]"]: ParticleEmitter;
					["FlashFX[Flash]"]: ParticleEmitter;
					["FlashFX3[Burst]"]: ParticleEmitter;
					["FlashFX[Light]"]: PointLight;
					Fire: Sound & {
						CompressorSoundEffect: CompressorSoundEffect;
					};
				};
				AimPart: Part;
				Trigger: Part & {
					Mesh: BlockMesh;
				};
				Bolt: UnionOperation & {
					BoltBack: Sound;
					BoltForward: Sound;
				};
				Chamber: Part & {
					Mesh: BlockMesh;
				};
				Shell: UnionOperation;
			};
			ExampleGizmo: Tool & {
				Base: Part;
			};
			Placement: Tool;
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
		KingOfTheHillChallenge: Folder & {
			Hill: Model & {
				Top: Part;
				MainSpawn: Part;
			};
		};
		GoldRushChallenge: Folder & {
			Model: Model;
			Underglow: Model;
			Claims: Model & {
				Highlight: Highlight;
			};
			Spawns: Folder;
		};
		MoneyPileChallenge: Folder & {
			Platforms: Model;
		};
		FlagMemoryChallenge: Folder & {
			["Christmas Tree"]: Model & {
				Lights: Model;
				Stump: Part;
				Skirt: UnionOperation;
				Star: MeshPart & {
					PointLight: PointLight;
				};
				Tree: Model;
				Ornaments: Model;
			};
			Rock: Model & {
				["happi rock"]: UnionOperation & {
					Decal: Decal;
					Weld: Weld;
				};
			};
			["Mr. beast"]: Model & {
				LeftLowerArm: MeshPart & {
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbow: Motor6D;
					OriginalSize: Vector3Value;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFoot: MeshPart & {
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					LeftAnkle: Motor6D;
				};
				RightHand: MeshPart & {
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWrist: Motor6D;
					RightGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
				};
				HumanoidRootPart: Part & {
					RootRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
				};
				RightLowerLeg: MeshPart & {
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightKnee: Motor6D;
				};
				LeftUpperLeg: MeshPart & {
					LeftHip: Motor6D;
					OriginalSize: Vector3Value;
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftLowerLeg: MeshPart & {
					OriginalSize: Vector3Value;
					LeftKnee: Motor6D;
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LowerTorso: MeshPart & {
					WaistCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					Root: Motor6D;
					RootRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Head: Part & {
					Neck: Motor6D;
					HatAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					HairAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					FaceFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					Mesh: SpecialMesh;
					FaceCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				UpperTorso: MeshPart & {
					RightCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					BodyBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					Waist: Motor6D;
					OriginalSize: Vector3Value;
					RightShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					BodyFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Tool: Tool & {
					handle: MeshPart;
				};
				["Body Colors"]: BodyColors;
				LeftUpperArm: MeshPart & {
					LeftShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					LeftShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftShoulder: Motor6D;
				};
				RightLowerArm: MeshPart & {
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightElbow: Motor6D;
					OriginalSize: Vector3Value;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftHand: MeshPart & {
					LeftWrist: Motor6D;
					LeftGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				MessyHair: Accessory & {
					Handle: Part & {
						OriginalSize: Vector3Value;
						TouchInterest: TouchTransmitter;
						HairAttachment: Attachment;
						AccessoryWeld: Weld;
						Mesh: SpecialMesh;
						WeldConstraint: WeldConstraint;
					};
				};
				Humanoid: Humanoid;
				RightUpperArm: MeshPart & {
					OriginalSize: Vector3Value;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulder: Motor6D;
				};
				RightUpperLeg: MeshPart & {
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHip: Motor6D;
					OriginalSize: Vector3Value;
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightFoot: MeshPart & {
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightAnkle: Motor6D;
				};
			};
			Part: Part & {
				Mesh: SpecialMesh;
				Weld: Weld;
			};
			["Office Chair"]: Model & {
				Part: Part & {
					Mesh: SpecialMesh;
					["This Chair was Made by Consend"]: IntValue;
				};
			};
			Tree: Model & {
				Bark: MeshPart;
			};
			Centers: Model;
			Spawn: Part;
		};
		_oldKingOfTheHillChallenge: Folder & {
			Hill: Model & {
				Base: Part;
				Top: Part;
			};
		};
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
		OldFlagMemoryChallenge: Folder & {
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
		PugilChallenge: Folder & {
			Lights: Model;
			Spawns: Folder & {
				Purple: Part;
				Yellow: Part;
				Orange: Part;
				Red: Part;
			};
		};
	};
	RBX_ANIMSAVES: Model;
}
