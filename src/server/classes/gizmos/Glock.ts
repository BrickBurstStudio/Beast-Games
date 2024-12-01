// import Make from "@rbxts/make";
// import { ReplicatedStorage, RunService, ServerStorage } from "@rbxts/services";
// import { InputData } from "shared/network";
// import { spawnSound } from "shared/utils/functions/spawnSound";
// import { Gizmo } from "../Gizmo";

// export class Glock extends Gizmo {
// 	animations = {
// 		idle: ReplicatedStorage.Assets.Animations.GlockIdle,
// 		activated: ReplicatedStorage.Assets.Animations.GlockShoot,
// 	};
// 	name = "Glock 19";
// 	tool = ServerStorage.Assets.Gizmos.Glock.Clone();
// 	activationType = "client" as const;

// 	private readonly BULLET_SPEED = 300;
// 	private readonly BULLET_LIFETIME = 3;
// 	private readonly DAMAGE = 50;

// 	activated(inputData: InputData | undefined) {
// 		if (!inputData) return;

// 		// Play gunshot sound
// 		spawnSound(ReplicatedStorage.Assets.Sounds, this.tool.PrimaryPart!);

// 		// Create bullet
// 		const bullet = Make("Part", {
// 			Name: "GlockBullet",
// 			Size: new Vector3(0.2, 0.2, 0.2),
// 			Color: Color3.fromRGB(255, 200, 0),
// 			Material: Enum.Material.Neon,
// 			CanCollide: false,
// 			Position: this.tool.PrimaryPart!.Position,
// 			Anchored: true,
// 		});

// 		// Create bullet trail
// 		const attachment0 = Make("Attachment", {
// 			Parent: bullet,
// 			Position: new Vector3(0, 0, 0),
// 		});

// 		const attachment1 = Make("Attachment", {
// 			Parent: bullet,
// 			Position: new Vector3(0, 0, -0.5),
// 		});

// 		const trail = Make("Trail", {
// 			Parent: bullet,
// 			Attachment0: attachment0,
// 			Attachment1: attachment1,
// 			Color: new ColorSequence(Color3.fromRGB(255, 200, 0)),
// 			Transparency: new NumberSequence(0, 1),
// 			Lifetime: 0.2,
// 		});

// 		bullet.Parent = game.Workspace;

// 		// Bullet physics and collision detection
// 		const bulletVelocity = inputData.direction.mul(this.BULLET_SPEED);
// 		const startTime = tick();

// 		const connection = game.GetService("RunService").Heartbeat.Connect(() => {
// 			const elapsed = tick() - startTime;
// 			if (elapsed > this.BULLET_LIFETIME) {
// 				connection.Disconnect();
// 				bullet.Destroy();
// 				return;
// 			}

// 			const newPos = bullet.Position.add(bulletVelocity.mul(RunService.Heartbeat.Wait()[0]));

// 			const raycastResult = game.Workspace.Raycast(
// 				bullet.Position,
// 				newPos.sub(bullet.Position),
// 				new RaycastParams(),
// 			);

// 			if (raycastResult && raycastResult.Instance) {
// 				connection.Disconnect();
// 				bullet.Destroy();

// 				const humanoid = raycastResult.Instance.FindFirstAncestorWhichIsA("Model")?.FindFirstChild(
// 					"Humanoid",
// 				) as Humanoid;
// 				if (humanoid) {
// 					humanoid.Health -= this.DAMAGE;
// 				}
// 				return;
// 			}

// 			bullet.Position = newPos;
// 		});
// 	}
// }
