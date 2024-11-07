export function spawnSound(sound: Sound, parent: Instance) {
	const clone = sound.Clone();
	clone.PlayOnRemove = true;
	clone.Parent = parent;
	clone.Destroy();
}
