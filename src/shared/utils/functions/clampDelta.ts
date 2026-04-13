export function clampDelta(value: number, last: number, maxStep: number) {
	const delta = value - last;
	if (math.abs(delta) <= maxStep) {
		return value;
	}
	return last + math.sign(delta) * maxStep;
}

export function lerpUnclamped(a: number, b: number, t: number) {
	return a + (b - a) * t;
}
