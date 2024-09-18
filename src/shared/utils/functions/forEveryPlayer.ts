import { Players } from "@rbxts/services";

type Callback = (player: Player, addedConn?: RBXScriptConnection) => (() => void) | void | Promise<(() => void) | void>;

function runCallback(player: Player, joinFunc: Callback, c?: RBXScriptConnection) {
	const cleanupPlayer = joinFunc(player, c);
	if (!cleanupPlayer) return;

	const leaveConn = Players.PlayerRemoving.Connect(async (playerLeaving) => {
		if (playerLeaving === player) {
			leaveConn.Disconnect();
			const cleanup = await cleanupPlayer;
			typeIs(cleanup, "function") && cleanup();
		}
	});
}

/**
 * 

 * @param joinFunc 
 * @param leaveFunc 
 * @example 
 * forEveryPlayer(
 * 	(player, playerAddedConn) => {
 * 		// ... do process for player
 *
 *			// playerAddedConn represents the PlayerAdded connection which spawned this function.
 * 		// disconnecting will prevent this callback from running for any future players.
 * 		if ("example condition is met") playerAddedConn?.Disconnect();
 *
 * 		// arg1's return func will run when this specific player leaves
 * 		return () => {
 * 			// ... do cleanup
 * 		};
 * 	},
 *
 *		// arg2 func is connected to PlayerRemoving
 * 	(player) => {},
 * );
 */

export function forEveryPlayer(joinFunc: Callback, leaveFunc?: (p: Player) => void) {
	if (leaveFunc) Players.PlayerRemoving.Connect(leaveFunc);

	Players.GetPlayers().forEach((p) => {
		runCallback(p, joinFunc);
	});
	const addedConn = Players.PlayerAdded.Connect((p) => runCallback(p, joinFunc, addedConn));
}
