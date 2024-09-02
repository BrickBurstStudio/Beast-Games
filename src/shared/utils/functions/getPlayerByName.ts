import { Players } from "@rbxts/services";

export function getPlayerByName(name: Player["Name"]) {
	return Players.GetChildren().find((p) => p.Name === name) as Player | undefined;
}
