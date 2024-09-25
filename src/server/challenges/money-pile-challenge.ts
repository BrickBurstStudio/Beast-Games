import { CollectionService, Players, ServerStorage } from "@rbxts/services";
import { BaseChallenge } from "./base-challenge";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { debounce } from "@rbxts/set-timeout";

type PlatformData = { eliminated: boolean; players: Player[]; platform: Model };

export class MoneyPileChallenge extends BaseChallenge {
	protected readonly map = ServerStorage.ChallengeMaps.MoneyPileChallenge;
	readonly platforms = this.map.Platforms.GetChildren() as Model[];
	readonly floorTag = "stadium-floor" as const;
	private platformData: PlatformData[] = [];

	protected async Main() {
		const [floor] = CollectionService.GetTagged(this.floorTag) as Part[];
		const floorConnection = floor.Touched.Connect((t) => {
			if (!t.Parent?.FindFirstChildOfClass("Humanoid")) return;
			if (!this.players.find((p) => p.Name === t.Parent?.Name)) return;
			const player = Players.GetPlayerFromCharacter(t.Parent);
			if (!player) return;
			const data = this.platformData.find((pd) => !!pd.players.find((p) => p === player));
			if (!data) return;
			if (data.eliminated) return;
			data.eliminated = true;
			print("elminaition");
			this.EliminatePlatform(data);
		});
		this.obliterator.Add(floorConnection, "Disconnect");

		task.wait(5000);
	}

	private EliminatePlatform({ platform, players }: PlatformData) {
		players.forEach((eP) => this.players.remove(this.players.findIndex((p) => p === eP)));
		platform.FindFirstChildOfClass("UnionOperation")!.Color = Color3.fromRGB(255, 0, 0);
		platform.FindFirstChild("Lights")!.FindFirstChildOfClass("PointLight")!.Color = Color3.fromRGB(255, 0, 0);
		print(platform);
	}

	protected SpawnCharacter({ player, character, i }: { player: Player; character: CharacterRigR6; i: number }) {
		const index = i & this.platforms.size();
		const platform = this.platforms[index];
		this.platformData[index] = {
			eliminated: false,
			players: [...(!!this.platformData[index] ? this.platformData[index].players : []), player],
			platform,
		};
		character.HumanoidRootPart.CFrame = platform
			.FindFirstChildOfClass("Part")!
			.CFrame.mul(new CFrame(0, platform.FindFirstChildOfClass("Part")!.Size.Y / 2 + 3, 0));
	}
}
