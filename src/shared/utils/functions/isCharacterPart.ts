export function isCharacterPart(part: BasePart) {
	return part.Parent?.FindFirstChildOfClass("Humanoid") !== undefined;
}
