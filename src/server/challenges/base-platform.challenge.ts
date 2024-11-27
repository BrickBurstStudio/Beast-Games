import { Lighting, ServerStorage } from "@rbxts/services";
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";
import Make from "@rbxts/make";
import { getCharacter } from "shared/utils/functions/getCharacter";

type PlatformState = "safe" | "eliminated" | "neutral";

export abstract class BasePlatformChallenge extends BaseChallenge {
	/* ------------------------------ Configurables ----------------------------- */
	static PLATFORM_STATE_COLORS: Record<PlatformState, Color3> = {
		safe: Color3.fromRGB(0, 255, 0),
		eliminated: Color3.fromRGB(255, 0, 0),
		neutral: Color3.fromRGB(255, 255, 255),
	};
	static GENERATION_POSITION = new CFrame(421.969, -541.535, -3784.157);

	protected map: Folder = Make("Folder", { Name: "GeneratedPlatforms" });
	protected platforms: PlatformT[] = [];
	protected playerToPlatform = new Map<Player, PlatformT>();

	protected async setup() {
		BasePlatformChallenge.transformScene("void");
		this.generatePlatforms();

		this.contestantDiedOrLeft.Event.Connect((player) => this.changePlatformState(player, "eliminated"));
	}

	protected spawnCharacter({ player, character, i }: SpawnCharacterArgs): void {
		const platform = this.platforms[i];
		const primaryPart = platform.PrimaryPart!;
		character.PivotTo(primaryPart.CFrame);
		this.playerToPlatform.set(player, platform);
	}

	protected generatePlatforms() {
		const platformSqrtCeil = math.ceil(math.sqrt(this.playersInChallenge.size()));
		for (let x = 0; x < platformSqrtCeil; x++) {
			for (let y = 0; y < platformSqrtCeil; y++) {
				if (
					x === platformSqrtCeil - 1 &&
					y === platformSqrtCeil - 1 &&
					this.playersInChallenge.size() > 1 &&
					this.playersInChallenge.size() % 2 === 1
				)
					continue;

				const platform = ServerStorage.Assets.Objects.Platform.Clone();
				platform.PivotTo(BasePlatformChallenge.GENERATION_POSITION.mul(new CFrame(x * 12, 0, y * 12)));
				platform.Parent = this.map;
				this.platforms.push(platform);
			}
		}
	}

	protected async dropPlayer(player: Player) {
		const platform = this.playerToPlatform.get(player);
		if (!platform) return;

		const character = await getCharacter(player);
		character.Humanoid.WalkSpeed = 0;
		character.Humanoid.JumpPower = 0;

		character.PivotTo(platform.PrimaryPart!.CFrame);

		platform.Door1.Transparency = 1;
		platform.Door1.CanCollide = false;
		platform.Door2.Transparency = 1;
		platform.Door2.CanCollide = false;
		task.wait(2);
		platform.Door1.Transparency = 0;
		platform.Door1.CanCollide = true;
		platform.Door2.Transparency = 0;
		platform.Door2.CanCollide = true;

		character.Humanoid.Health = 0;
	}

	protected changePlatformState(player: Player, state: PlatformState) {
		const platform = this.playerToPlatform.get(player);
		if (!platform) return;

		platform.Lighting.Union.Color = BasePlatformChallenge.PLATFORM_STATE_COLORS[state];
		platform.Lighting.Part.SpotLight.Color = BasePlatformChallenge.PLATFORM_STATE_COLORS[state];
	}

	static transformScene(scene: "void" | "normal") {
		if (scene === "void") {
			Lighting.FogEnd = 500;
			Lighting.FogStart = 150;
			ServerStorage.Assets.Skybox.Void.Clone().Parent = Lighting;
		} else {
			Lighting.FogEnd = 999999;
			Lighting.FogStart = 0;
			Lighting.FindFirstChild("Void")?.Destroy();
		}
	}
}
