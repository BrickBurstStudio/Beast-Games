export function calculateReward(round: number, baseReward: number, growthRate: number): number {
	// Ensure the round is a positive integer
	round = math.max(1, math.floor(round));

	// Calculate the reward using the exponential formula: baseReward * (growthRate ^ (round - 1))
	const reward = baseReward * math.pow(growthRate, round - 1);

	// Round the reward to two decimal places
	return math.floor(math.round(reward * 100) / 100);
}
