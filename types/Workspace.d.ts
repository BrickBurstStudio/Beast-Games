interface Workspace extends Model {
	Leaderboards: Folder & {
		playTime: Model & {
			RightPole: Model;
			Middle: Model & {
				Face: Part;
			};
			LeftPole: Model;
		};
		honor: Model & {
			RightPole: Model;
			Middle: Model & {
				Face: Part;
			};
			LeftPole: Model;
		};
		gems: Model & {
			RightPole: Model;
			Middle: Model & {
				Face: Part;
			};
			LeftPole: Model;
		};
		wins: Model & {
			RightPole: Model;
			Middle: Model & {
				Face: Part;
			};
			LeftPole: Model;
		};
		xp: Model & {
			RightPole: Model;
			Middle: Model & {
				Face: Part;
			};
			LeftPole: Model;
		};
		cash: Model & {
			RightPole: Model;
			Middle: Model & {
				Face: Part;
			};
			LeftPole: Model;
		};
	};
	Stand: Model & {
		Part: Part;
		Primary: Part;
	};
	MoneyPileChallenge: Folder & {
		Money: Model & {
			Collision: Part;
		};
		Platforms: Model;
	};
	Part: Part;
	Folder: Folder;
	Briefcase: Model & {
		Part: Part & {
			Mesh: SpecialMesh;
			BillboardGui: BillboardGui & {
				TextLabel: TextLabel;
			};
		};
	};
	Baseplate: Part;
	Forcefield: Part & {
		Mesh: SpecialMesh;
	};
	Camera: Camera;
	["Mr. Sigma"]: Model & {
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
			OriginalSize: Vector3Value;
			LeftAnkleRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
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
			RightKnee: Motor6D;
			OriginalSize: Vector3Value;
		};
		LeftUpperLeg: MeshPart & {
			OriginalSize: Vector3Value;
			LeftHip: Motor6D;
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
			HatAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
			NeckRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			FaceFrontAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			HairAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			Neck: Motor6D;
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
			OriginalSize: Vector3Value;
			Waist: Motor6D;
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
		["Body Colors"]: BodyColors;
		LeftUpperArm: MeshPart & {
			LeftShoulderRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftShoulder: Motor6D;
			LeftShoulderAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftElbowRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
		};
		RightLowerArm: MeshPart & {
			RightWristRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
			RightElbow: Motor6D;
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
			OriginalSize: Vector3Value;
			RightHip: Motor6D;
			RightHipRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		RightFoot: MeshPart & {
			RightAnkleRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			RightAnkle: Motor6D;
			OriginalSize: Vector3Value;
		};
	};
	_: Model & {
		["Left Leg"]: Part & {
			LeftFootAttachment: Attachment;
		};
		Humanoid: Humanoid & {
			Animator: Animator;
			HumanoidDescription: HumanoidDescription;
		};
		["Right Leg"]: Part & {
			RightFootAttachment: Attachment;
		};
		Head: Part & {
			HatAttachment: Attachment;
			FaceFrontAttachment: Attachment;
			TitleBGUI: BillboardGui & {
				UIListLayout: UIListLayout;
				Frame: Frame & {
					UIListLayout: UIListLayout;
				};
				TextLabel: TextLabel;
			};
			HairAttachment: Attachment;
			face: Decal;
			Mesh: SpecialMesh;
			FaceCenterAttachment: Attachment;
		};
		Torso: Part & {
			RightCollarAttachment: Attachment;
			WaistCenterAttachment: Attachment;
			BodyBackAttachment: Attachment;
			Neck: Motor6D;
			LeftCollarAttachment: Attachment;
			["Right Shoulder"]: Motor6D;
			roblox: Decal;
			["Left Hip"]: Motor6D;
			["Right Hip"]: Motor6D;
			["Left Shoulder"]: Motor6D;
			BodyFrontAttachment: Attachment;
			WaistBackAttachment: Attachment;
			WaistFrontAttachment: Attachment;
			NeckAttachment: Attachment;
		};
		HumanoidRootPart: Part & {
			RootJoint: Motor6D;
			RootAttachment: Attachment;
		};
		["Right Arm"]: Part & {
			RightShoulderAttachment: Attachment;
			RightGripAttachment: Attachment;
		};
		["Left Arm"]: Part & {
			LeftGripAttachment: Attachment;
			LeftShoulderAttachment: Attachment;
		};
		AnimSaves: ObjectValue;
		["Body Colors"]: BodyColors;
		Animate: LocalScript & {
			idle: StringValue & {
				Animation2: Animation & {
					Weight: NumberValue;
				};
				Animation1: Animation & {
					Weight: NumberValue;
				};
			};
			jump: StringValue & {
				JumpAnim: Animation;
			};
			sit: StringValue & {
				SitAnim: Animation;
			};
			run: StringValue & {
				RunAnim: Animation;
			};
			toolnone: StringValue & {
				ToolNoneAnim: Animation;
			};
			ScaleDampeningPercent: NumberValue;
			PlayEmote: BindableFunction;
			fall: StringValue & {
				FallAnim: Animation;
			};
			climb: StringValue & {
				ClimbAnim: Animation;
			};
			walk: StringValue & {
				WalkAnim: Animation;
			};
		};
	};
	Stadium: Model & {
		Center: Part;
		Model: Model & {
			Model: Model & {
				Model: Model & {
					Model: Model & {
						Model: Model & {
							Model: Model & {
								Model: Model & {
									["Meshes/AllegiantFire_Main1"]: MeshPart;
									["Meshes/AllegiantFire_LED1"]: MeshPart;
									Curtain1: MeshPart;
									["Meshes/AllegiantFire_Main2"]: MeshPart;
									Folder: Folder & {
										Part: Part;
									};
									["Meshes/AllegiantFire_Main3"]: MeshPart;
									["Meshes/AllegiantFire_LED2"]: MeshPart;
									["Meshes/AllegiantFire_LED3"]: MeshPart;
									ThreeDTextHandle: Part;
								};
							};
						};
					};
				};
			};
		};
	};
}
