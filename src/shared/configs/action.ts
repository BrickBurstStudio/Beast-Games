import { getCharacter } from "shared/utils/functions/getCharacter";

export type Action = {
	name: string;
	cost: number;
	callback: (args: { fromPlayer: Player; toPlayer: Player }) => void;
};
export const actions = [
	{
		name: "Add 3 Lives",
		cost: 1,
		callback: ({ toPlayer }) => {
			const lives = (toPlayer.GetAttribute("lives") as number) ?? 0;
			toPlayer.SetAttribute("lives", lives + 3);
		},
	},
	{
		name: "Fling",
		cost: 1,
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
		name: "Kidnap",
		cost: 1,
		callback: async ({ toPlayer }) => {},
	},
	{
		name: "Giant Mode",
		cost: 1,
		callback: async ({ toPlayer }) => {
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
	},
	{
		name: "Boogie Bomb",
		cost: 1,
		callback: async ({ toPlayer }) => {
			const character = await getCharacter(toPlayer);
			if (!character) return;

			const animator = character.Humanoid.Animator;

			// Load a dance animation
			const danceAnim = new Instance("Animation");
			danceAnim.AnimationId = "rbxassetid://"; // TODO: Add realdance animation
			const danceTrack = animator.LoadAnimation(danceAnim);

			danceTrack.Play();
			task.wait(15);
			danceTrack.Stop();
		},
	},
	{
		name: "Glock 19 (Gun)",
		cost: 1,
		callback: async ({ toPlayer }) => {

		},
	},
	{
		name: "Nuke",
		cost: 1,
		callback: async ({ toPlayer }) => {
			
		},
	},
] as const satisfies Action[];


export type ActionName = (typeof actions)[number]["name"];
