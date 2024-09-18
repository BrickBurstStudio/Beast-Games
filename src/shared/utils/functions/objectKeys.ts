export function objectKeys(obj: any): string[] {
	const keys: string[] = [];
	for (const [k, _] of pairs(obj)) keys.push(k as string);
	return keys;
}
