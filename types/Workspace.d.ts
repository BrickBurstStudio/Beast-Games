interface Workspace extends Model {
	Trees: Folder;
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
	ShiftToRun: Model & {
		README: Script;
		Configuration: ModuleScript;
		ShiftToRun: LocalScript;
	};
	ExampleGizmo: Tool & {
		Base: Part;
	};
	Stadium2: Model & {
		["Meshes/AllegiantFire_Main1"]: MeshPart;
		["Meshes/AllegiantFire_LED1"]: MeshPart;
		Curtain1: MeshPart;
		["Meshes/AllegiantFire_Main2"]: MeshPart;
		Void: Model;
		Folder: Folder;
		Center: Part;
		["Meshes/AllegiantFire_LED2"]: MeshPart;
		["Meshes/AllegiantFire_Main3"]: MeshPart;
		ThreeDTextHandle: Part;
		["Meshes/AllegiantFire_LED3"]: MeshPart;
	};
	["The City"]: Model & {
		Ball: Part;
		["Chess Map"]: Model & {
			Blacks: Model & {
				BKing: Model & {
					Welder: Script;
				};
				BQueen: Model & {
					Welder: Script;
				};
			};
			Whites: Model & {
				WKing: Model & {
					Welder: Script;
				};
				WQueen: Model & {
					Welder: Script;
				};
			};
			Board: Model & {
				Pads: Model & {
					WhitePads: Model;
					BlackPads: Model;
				};
			};
		};
		Seat: Seat;
		["Basketball Court"]: Model & {
			["Basketball Court"]: Folder & {
				["Three point lines"]: Folder;
				["Freethrow and stuffs"]: Folder;
				["Basketball Hoops"]: Folder;
				Court: Part;
				Outlines: Model;
				["Half-Court"]: Model & {
					Part: Part;
					Union: UnionOperation;
				};
			};
		};
		sdfsdfsdf2: Model & {
			["Cube.022"]: MeshPart;
			["Cube.020"]: MeshPart;
			["Cube.037"]: MeshPart;
			["Cube.001"]: MeshPart & {
				["Cube.006"]: MeshPart;
				["Cube.005"]: MeshPart;
				["Cube.004"]: MeshPart;
				["Cube.003"]: MeshPart;
				["Cube.002"]: MeshPart;
			};
			["Cube.033"]: MeshPart;
			["Cube.012"]: MeshPart & {
				["Cube.021"]: MeshPart;
				["Cube.014"]: MeshPart;
				["Cube.017"]: MeshPart;
				["Cube.015"]: MeshPart;
				["Cube.027"]: MeshPart;
				["Cube.024"]: MeshPart;
				["Cube.025"]: MeshPart;
				["Cube.018"]: MeshPart;
				["Cube.026"]: MeshPart;
				["Cube.016"]: MeshPart;
				["Cube.013"]: MeshPart;
				["Cube.023"]: MeshPart;
			};
			["Cube.034"]: MeshPart;
			["Cube.035"]: MeshPart;
			["Cube.032"]: MeshPart;
			["Cube.028"]: MeshPart;
			["Cube.029"]: MeshPart;
			["Cube.019"]: MeshPart;
			Cube: MeshPart;
			["Cube.031"]: MeshPart & {
				["Cube.030"]: MeshPart;
			};
			["Cube.036"]: MeshPart;
		};
		Door: Model & {
			Doorframe: Model;
			Base: Part & {
				SpringAttachment1: Attachment;
				HingeAttachment1: Attachment;
				Window: Part;
				Visual: UnionOperation;
			};
		};
	};
	Camera: Camera;
	Baseplate: Part;
	Model: Model;
	["VIP HOUSE"]: Folder;
	Stadium: Model & {
		["Meshes/AllegiantFire_Main1"]: MeshPart;
		["Meshes/AllegiantFire_LED1"]: MeshPart;
		Curtain1: MeshPart;
		["Meshes/AllegiantFire_Main3"]: MeshPart;
		["Meshes/AllegiantFire_Main2"]: MeshPart;
		Folder: Folder & {
			Part: Part;
		};
		Center: Part;
		["Meshes/AllegiantFire_LED2"]: MeshPart;
		["Meshes/AllegiantFire_LED3"]: MeshPart;
		ThreeDTextHandle: Part;
	};
	Guh: Part;
}
