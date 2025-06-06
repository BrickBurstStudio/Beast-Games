import { Lighting, ReplicatedStorage, StarterPlayer } from "@rbxts/services";
import { Events } from "server/network";
import { ActionName } from "shared/configs/actions";
import { getCharacter } from "shared/utils/functions/getCharacter";

export type ActionHandler = (args: { fromPlayer: Player; toPlayer: Player }) => void;

export const actionHandlers: Record<ActionName, ActionHandler> = {
	"Add 3 Lives": ({ toPlayer }) => {
		const lives =
			(toPlayer.GetAttribute("lives") as number | undefined) === undefined
				? 0
				: (toPlayer.GetAttribute("lives") as number);
		toPlayer.SetAttribute("lives", lives + 3);
	},

	"Glock 19": async ({ fromPlayer, toPlayer }) => {
		// TODO: Implement glock 19 action
	},

	Fling: async ({ toPlayer }) => {
		const character = await getCharacter(toPlayer);
		const VELOCITY_MAGNITUDE = 100;
		const MAX_FORCE_MULTIPLIER = 2000;

		// Generate random direction
		const randomAngle = math.random() * math.pi * 2;
		const direction = new Vector3(math.cos(randomAngle), 0.5, math.sin(randomAngle)).Unit;

		// Create LinearVelocity instance
		const velocity = new Instance("LinearVelocity");
		velocity.Name = "FlingVelocity";
		velocity.Attachment0 = character.HumanoidRootPart.RootAttachment;
		velocity.RelativeTo = Enum.ActuatorRelativeTo.World;
		velocity.MaxForce = MAX_FORCE_MULTIPLIER * character.HumanoidRootPart.AssemblyMass;
		velocity.VectorVelocity = direction.mul(VELOCITY_MAGNITUDE);
		velocity.Parent = character.HumanoidRootPart;

		// Remove the velocity after a short duration
		task.delay(0.1, () => {
			velocity.Destroy();
		});
	},

	"Giant Mode": async ({ toPlayer }) => {
		const character = await getCharacter(toPlayer);
		const originalSize = character.GetScale();
		const targetSize = 2.5;

		// Smoothly scale up
		for (let t = 0; t < 1; t += 0.1) {
			character.ScaleTo(originalSize + (targetSize - originalSize) * t);
			task.wait(0.05);
		}

		task.wait(30);

		// Smoothly scale down
		for (let t = 0; t < 1; t += 0.1) {
			character.ScaleTo(targetSize + (originalSize - targetSize) * t);
			task.wait(0.05);
		}
	},

	"Boogie Bomb": async ({ toPlayer }) => {
		const character = await getCharacter(toPlayer);
		if (!character) return;

		const boogieBomb = ReplicatedStorage.Assets.Animations.Emotes.BoogieBomb;

		character.Humanoid.WalkSpeed = 0;
		Events.animationController.play.fire(toPlayer, boogieBomb);
		task.wait(15);
		Events.animationController.stop.fire(toPlayer, boogieBomb);
		character.Humanoid.WalkSpeed = StarterPlayer.CharacterWalkSpeed;
	},

	Nuke: async ({ toPlayer }) => {
		const character = await getCharacter(toPlayer);
		if (!character) return;

		// Create nuke part that falls from sky
		const nuke = new Instance("Part");
		nuke.Size = new Vector3(3, 8, 3);
		nuke.Color = Color3.fromRGB(50, 50, 50);
		nuke.Material = Enum.Material.Metal;
		nuke.Shape = Enum.PartType.Cylinder;
		nuke.CFrame = new CFrame(character.HumanoidRootPart.Position.add(new Vector3(0, 200, 0))).mul(
			CFrame.Angles(0, 0, math.rad(90)),
		);
		nuke.Parent = character;

		// Add fins to nuke
		for (let i = 0; i < 4; i++) {
			const fin = new Instance("WedgePart");
			fin.Size = new Vector3(1, 2, 1);
			fin.Color = Color3.fromRGB(50, 50, 50);
			fin.Material = Enum.Material.Metal;
			fin.CFrame = nuke.CFrame.mul(
				CFrame.Angles(0, math.rad(90 * i), 0)
					.mul(new CFrame(2, 0, 0))
					.mul(CFrame.Angles(math.rad(90), 0, 0)),
			);
			fin.Parent = nuke;
			const weld = new Instance("WeldConstraint");
			weld.Part0 = nuke;
			weld.Part1 = fin;
			weld.Parent = nuke;
		}

		// Add warning light
		const warningLight = new Instance("PointLight");
		warningLight.Color = Color3.fromRGB(255, 0, 0);
		warningLight.Range = 15;
		warningLight.Parent = nuke;

		// Create falling motion
		const bodyVelocity = new Instance("BodyVelocity");
		bodyVelocity.MaxForce = new Vector3(0, math.huge, 0);
		bodyVelocity.Velocity = new Vector3(0, -100, 0);
		bodyVelocity.Parent = nuke;

		// Create spinning motion
		const bodyAngularVelocity = new Instance("BodyAngularVelocity");
		bodyAngularVelocity.MaxTorque = new Vector3(math.huge, 0, math.huge);
		bodyAngularVelocity.AngularVelocity = new Vector3(0, 5, 0);
		bodyAngularVelocity.Parent = nuke;

		// Wait for impact
		const connection = nuke.Touched.Connect((part) => {
			if (part.CanCollide) {
				connection.Disconnect();
				nuke.Destroy();

				// Create explosion effect
				const explosion = new Instance("Explosion");
				explosion.Position = nuke.Position;
				explosion.BlastRadius = 20;
				explosion.BlastPressure = 500000;
				explosion.ExplosionType = Enum.ExplosionType.NoCraters;
				explosion.DestroyJointRadiusPercent = 0;
				explosion.Parent = character;

				// Create flash effect
				const flash = new Instance("PointLight");
				flash.Color = Color3.fromRGB(255, 255, 255);
				flash.Range = 200;
				flash.Brightness = 5;
				flash.Parent = character;

				// Create heat distortion effect
				const atmosphere = new Instance("Atmosphere");
				atmosphere.Density = 0.5;
				atmosphere.Color = Color3.fromRGB(255, 170, 0);
				atmosphere.Parent = Lighting;

				// Animate flash and atmosphere
				for (let i = 0; i < 1; i += 0.05) {
					flash.Brightness = 5 * (1 - i);
					atmosphere.Density = 0.5 * (1 - i);
					task.wait(0.05);
				}

				// Cleanup effects
				flash.Destroy();
				atmosphere.Destroy();
				character.Humanoid.Health = 0;
			}
		});
	},
} as const;
