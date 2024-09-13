export function getLevel(xp: number): number {
	return math.floor(math.sqrt(xp) / 3);
}
