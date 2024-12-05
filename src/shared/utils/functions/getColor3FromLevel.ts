export function getColor3FromLevel(level: number) {
	return Color3.fromHSV((level % 100) / 100, 1, 1);
}
