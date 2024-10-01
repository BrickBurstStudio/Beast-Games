import { CharacterRigR6, promiseR6 } from "@rbxts/promise-character";

export async function getCharacter(player: Player) {
	const character = await promiseR6(player.Character ?? player.CharacterAdded.Wait()[0]);

	return character as CharacterRigR6;
}
