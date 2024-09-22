export function generatePlayerGrid(numPlayers: number, badCases: number) {
	// Calculate the dimensions of the grid
	const sqrtPlayers = math.sqrt(numPlayers);
	const rows = math.ceil(sqrtPlayers);
	const cols = math.ceil(numPlayers / rows);

	// Create an array of all possible positions
	const positions: [number, number][] = [];
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			positions.push([i, j]);
		}
	}

	// Shuffle the positions array
	for (let i = positions.size() - 1; i > 0; i--) {
		const j = math.floor(math.random() * (i + 1));
		[positions[i], positions[j]] = [positions[j], positions[i]];
	}

	// Initialize the grid
	const grid: boolean[][] = [];

	// Place players in the shuffled positions
	for (let i = 0; i < numPlayers; i++) {
		const [row, col] = positions[i];
		grid[row] = grid[row] ?? [];
		grid[row][col] = true;
	}

	// Remove empty rows and columns
	const finalGrid = grid
		.filter((row) => row.some((cell) => cell))
		.map((row) => row.filter((_, index) => grid.some((r) => r[index])));

	return finalGrid;
}
