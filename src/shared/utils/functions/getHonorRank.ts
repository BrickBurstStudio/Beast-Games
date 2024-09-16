const ranks = ["Psychopath", "Selfish", "Suspicious", "Decent", "Respected", "Saint", "Godlike"];

export function getHonorRank(honor: number) {
	// create some algorithm that can return a level to assign from `ranks`
	return ranks[math.floor(ranks.size() / 2)];
}
