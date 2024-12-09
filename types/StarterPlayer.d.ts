interface StarterPlayer extends Instance {
	StarterCharacter: Model & {
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
			["Left Hip"]: Motor6D;
			roblox: Decal;
			["Right Hip"]: Motor6D;
			["Left Shoulder"]: Motor6D;
			["Right Shoulder"]: Motor6D;
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
	StarterPlayerScripts: StarterPlayerScripts & {
		TS: Folder & {
			runtime: LocalScript;
			network: ModuleScript;
			components: Folder;
			ui: Folder & {
				apps: Folder & {
					sprint: ModuleScript;
					app: ModuleScript;
					leaderboards: ModuleScript & {
						leaderboard: ModuleScript;
						player: ModuleScript;
					};
					rhthym: ModuleScript;
					spectate: ModuleScript;
					message: ModuleScript;
					menu: Folder & {
						pages: Folder & {
							achievements: ModuleScript;
							shop: ModuleScript;
							settings: ModuleScript;
							inventory: ModuleScript;
							actions: ModuleScript & {
								playerSelectModal: ModuleScript;
								tokenPackagesModal: ModuleScript;
							};
							trading: ModuleScript;
						};
						buttons: ModuleScript;
					};
					animateEvents: ModuleScript;
					queue: ModuleScript;
					challenges: ModuleScript & {
						["tower-build"]: ModuleScript;
						boulder: ModuleScript;
						["flag-memory"]: ModuleScript;
						bribe: ModuleScript;
						["king-of-hill"]: ModuleScript;
						["split-or-steal"]: ModuleScript;
					};
					announce: ModuleScript & {
						countdown: ModuleScript;
						rules: ModuleScript;
						announcer: ModuleScript;
					};
					["lives-display"]: ModuleScript;
				};
				utils: Folder & {
					usePx: ModuleScript;
				};
				components: Folder & {
					["emote-preview"]: ModuleScript;
					["image-button"]: ModuleScript;
					modal: ModuleScript;
					["menu-frame"]: ModuleScript;
				};
				["app.story"]: ModuleScript;
			};
			store: ModuleScript & {
				middleware: Folder & {
					receiver: ModuleScript;
				};
			};
			cmdr: LocalScript;
			controllers: Folder & {
				["gizmo.controller"]: ModuleScript;
				["movement.controller"]: ModuleScript;
				["sprint.controller"]: ModuleScript;
				["gui.controller"]: ModuleScript;
				["animation.controller"]: ModuleScript;
				["unbox.controller"]: ModuleScript;
				["general.controller"]: ModuleScript;
				["spectate.controller"]: ModuleScript;
				["sound.controller"]: ModuleScript;
				["log.controller"]: ModuleScript;
			};
		};
	};
	TextLabel: TextLabel;
	StarterCharacterScripts: StarterCharacterScripts & {
		DisableReset: LocalScript;
	};
}
