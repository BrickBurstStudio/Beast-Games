import { getCharacter } from "shared/utils/functions/getCharacter";

export type Action = {
	name: string;
	cost: number;
	callback: (args: { fromPlayer: Player; toPlayer: Player }) => void;
};

export const divine = [
	{
		name: "Revive",
		cost: 1,
		callback: ({ fromPlayer, toPlayer }) => {},
	},
] as const satisfies Action[];

export const deviousLicks = [
	{
		name: "Ragdoll",
		cost: 1,
		callback: ({ toPlayer }) => {
			const character = toPlayer.Character;
			if (!character) return;

			const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
			if (!humanoid) return;

			const animator = humanoid.FindFirstChild("Animator") as Animator;
			if (!animator) return;

			humanoid.PlatformStand = true;
			humanoid.Sit = true;

			task.wait(10);

			humanoid.PlatformStand = false;
			humanoid.Sit = false;
		},
	},
	{
		name: "Fling",
		cost: 5,
		callback: async ({ fromPlayer, toPlayer }) => {
			const character = await getCharacter(toPlayer);
			const VELOCITY_MAGNITUDE = 100;
			const MAX_FORCE_MULTIPLIER = 2000;

			// Generate random direction
			const randomAngle = math.random() * math.pi * 2;
			const direction = new Vector3(math.cos(randomAngle), 1.5, math.sin(randomAngle)).Unit;

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
	},
	{
		name: "Freeze Ray",
		cost: 1,
		callback: async ({ toPlayer }) => {
			const character = await getCharacter(toPlayer);
			const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
			if (!humanoid) return;

			const originalWalkSpeed = humanoid.WalkSpeed;
			const originalJumpPower = humanoid.JumpPower;

			humanoid.WalkSpeed = 0;
			humanoid.JumpPower = 0;

			// Create ice particle effect
			const freezeEffect = new Instance("ParticleEmitter");
			freezeEffect.Color = new ColorSequence(new Color3(0.8, 0.9, 1));
			freezeEffect.Parent = character.HumanoidRootPart;

			task.wait(10);

			humanoid.WalkSpeed = originalWalkSpeed;
			humanoid.JumpPower = originalJumpPower;
			freezeEffect.Destroy();
		},
	},
	{
		name: "Giant Mode",
		cost: 4,
		callback: async ({ toPlayer }) => {
			const character = await getCharacter(toPlayer);
			const originalSize = character.GetScale();
			const targetSize = 2.5;

			// Smoothly scale up
			for (let t = 0; t < 1; t += 0.1) {
				character.ScaleTo(originalSize + (targetSize - originalSize) * t);
				task.wait(0.05);
			}

			task.wait(10);

			// Smoothly scale down
			for (let t = 0; t < 1; t += 0.1) {
				character.ScaleTo(targetSize + (originalSize - targetSize) * t);
				task.wait(0.05);
			}
		},
	},
	{
		name: "Dance Virus",
		cost: 3,
		callback: async ({ toPlayer }) => {
			const character = await getCharacter(toPlayer);
			if (!character) return;

			const animator = character.Humanoid.Animator;

			// Load a dance animation
			const danceAnim = new Instance("Animation");
			danceAnim.AnimationId = "rbxassetid://"; // TODO: Add realdance animation
			const danceTrack = animator.LoadAnimation(danceAnim);

			danceTrack.Play();
			task.wait(10);
			danceTrack.Stop();
		},
	},
] as const satisfies Action[];

export const actions = [...divine, ...deviousLicks] as const satisfies Action[];

export type ActionName = (typeof actions)[number]["name"];
