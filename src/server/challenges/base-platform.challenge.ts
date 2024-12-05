import { Lighting, Players, ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { BaseChallenge, SpawnCharacterArgs } from "./base.challenge";
import Make from "@rbxts/make";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { spawnSound } from "shared/utils/functions/spawnSound";
import { CharacterRigR6 } from "@rbxts/promise-character";

type PlatformState = "safe" | "warning" | "eliminated" | "neutral";

export abstract class BasePlatformChallenge extends BaseChallenge {
	/* ------------------------------ Configurables ----------------------------- */
	static PLATFORM_STATE_COLORS: Record<PlatformState, Color3> = {
		safe: Color3.fromRGB(0, 255, 0),
		warning: Color3.fromRGB(255, 255, 0),
		eliminated: Color3.fromRGB(255, 0, 0),
		neutral: Color3.fromRGB(255, 255, 255),
	};
	static GENERATION_POSITION = new CFrame(421.969, -541.535, -3784.157);

	protected map: Folder = Make("Folder", { Name: "GeneratedPlatforms" });
	protected platforms: PlatformT[] = [];
	protected playerToPlatform = new Map<Player, PlatformT>();
	protected platformStates = new Map<PlatformT, PlatformState>();
	protected platformDistance = 12;

	protected async setup() {
		BasePlatformChallenge.transformScene("void");
		this.platformDistance = this.challengeName === "Tower Dodgeball" ? 50 : 12;
		this.generatePlatforms();

		this.obliterator.Add(
			this.contestantDiedOrLeft.Event.Connect((player) => this.changePlatformState(player, "eliminated")),
		);
	}

	protected spawnCharacter({ player, character, i }: SpawnCharacterArgs): void {
		const platform = this.platforms[i];
		const primaryPart = platform.PrimaryPart!;
		character.PivotTo(primaryPart.CFrame);
		this.playerToPlatform.set(player, platform);
	}

	protected generatePlatforms() {
		const playerCount = this.playersInChallenge.size();
		const platformSqrtCeil = math.ceil(math.sqrt(playerCount));
		let platformsCreated = 0;

		for (let x = 0; x < platformSqrtCeil; x++) {
			for (let y = 0; y < platformSqrtCeil; y++) {
				if (platformsCreated >= playerCount) break;

				const platform = ServerStorage.Assets.Objects.Platform.Clone();
				platform.PivotTo(
					BasePlatformChallenge.GENERATION_POSITION.mul(
						new CFrame(x * this.platformDistance, 0, y * this.platformDistance),
					),
				);
				platform.Parent = this.map;
				this.platforms.push(platform);
				platformsCreated++;
			}
			if (platformsCreated >= playerCount) break;
		}
	}

	protected async dropCharacter(character: CharacterRigR6) {
		try {
			const player = Players.GetPlayerFromCharacter(character);
			if (!player) return;

			const platform = this.playerToPlatform.get(player);
			if (!platform) return;

			this.playersInChallenge = this.playersInChallenge.filter((p) => p !== player);
			this.changePlatformState(player, "eliminated");

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
			task.wait(1);
		} catch {
			warn(`Failed to drop character ${character.Name}`);
		}
	}

	protected changePlatformState(player: Player, state: PlatformState) {
		const platform = this.playerToPlatform.get(player);
		if (!platform || this.platformStates.get(platform) === state) return;

		this.platformStates.set(platform, state);

		platform.Lighting.Union.Color = BasePlatformChallenge.PLATFORM_STATE_COLORS[state];
		platform.Lighting.Part.SpotLight.Color = BasePlatformChallenge.PLATFORM_STATE_COLORS[state];

		if (state === "eliminated") spawnSound(ReplicatedStorage.Assets.Sounds.Buzz, platform);
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
