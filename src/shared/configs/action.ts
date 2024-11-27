import { getCharacter } from "shared/utils/functions/getCharacter";

export type Action = {
	id: number;
	name: string;
	callback: (args: { fromPlayer: Player; toPlayer: Player }) => void;
};

export const divine = [
	{
		id: 1,
		name: "Revive",
		callback: ({ fromPlayer, toPlayer }) => {},
	},
] as const satisfies Action[];

export const deviousLicks = [
	{
		id: 2320616747,
		name: "Ragdoll",
		callback: ({ toPlayer }) => {
			const character = toPlayer.Character;
			if (!character) return;

			const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
			if (!humanoid) return;

			const animator = humanoid.FindFirstChild("Animator") as Animator;
			if (!animator) return;

			humanoid.PlatformStand = true;
			humanoid.Sit = true;

			const ragdollDuration = 3;
			task.wait(ragdollDuration);

			humanoid.PlatformStand = false;
			humanoid.Sit = false;
		},
	},
	{
		id: 2664589454,
		name: "Fling",
		callback: async ({ fromPlayer, toPlayer }) => {
			const character = await getCharacter(toPlayer);
			const VELOCITY_MAGNITUDE = 100;
			const MAX_FORCE_MULTIPLIER = 2000;

			// Generate random direction
			const randomAngle = math.random() * math.pi * 2;
			const direction = new Vector3(
				math.cos(randomAngle),
				1.5,
				math.sin(randomAngle)
			).Unit;

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
] as const satisfies Action[];

export const actions = [...divine, ...deviousLicks] as const satisfies Action[];

export type ActionId = (typeof actions)[number]["id"];
