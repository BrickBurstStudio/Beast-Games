export function getPlayerMultiplier(player: Player) {
	if (player.MembershipType === Enum.MembershipType.Premium) return 1.25;
	return 1;
}
