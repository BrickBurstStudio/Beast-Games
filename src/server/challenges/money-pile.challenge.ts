import { CharacterRigR6 } from "@rbxts/promise-character";
import { CollectionService, Players, ReplicatedStorage, ServerStorage, TweenService, Workspace } from "@rbxts/services";
import { BaseChallenge } from "./base.challenge";
import { Events } from "server/network";
import { announce } from "server/util/announce";
import { countdown } from "server/util/countdown";
import Make from "@rbxts/make";
import createForcefield from "shared/utils/functions/createForcefield";

type PlatformData = { eliminated: boolean; players: Player[]; platform: TPlatform };

export class MoneyPileChallenge extends BaseChallenge {
	protected readonly map = ServerStorage.ChallengeMaps.MoneyPileChallenge.Clone();
	readonly platforms = this.map.Platforms.GetChildren() as TPlatform[];
	readonly floorTag = "stadium-floor" as const;
	private platformData: PlatformData[] = [];

	protected async Main() {
		const forcefields = this.platforms.map((platform) => this.CreateForcefield(platform));

		this.SetupPlatforms();
		this.SetupFloor();

		await announce([
			"Right now, there is a barrier preventing you from leaving your platform.",

			// todo: add rich text support for announcer. would be great.
			"If anyone leaves your platform, everyone on it will be eliminated, including you.",
		]);

		await countdown({
			seconds: 5,
			description: "Removing barrier",
		});

		forcefields.forEach((forcefield) => forcefield.Destroy());
		ReplicatedStorage.Assets.Sounds.Boom.Play();

		await announce([
			"Soon, I will bribe everyone with a series of 3 piles of money.",
			"They will fall one by one, increasing in value every time.",
			"The first player to touch a money pile will receive the cash reward.",
			"HOWEVER...",
			"If you leave your platform, everyone on it will be eliminated, including yourself.",
			"Eliminate yourself with everyone on your platform to go for the cash, or stay? You decide.",
		]);

		// todo: implement second countdown in the actual description text

		Events.challenges.moneyPileChallenge.dropMoney.broadcast(ReplicatedStorage.Assets.Objects.SmallMoney);

		await countdown({
			seconds: 30,
		});

		Events.challenges.moneyPileChallenge.dropMoney.broadcast(ReplicatedStorage.Assets.Objects.MediumMoney);

		await countdown({
			seconds: 30,
		});

		Events.challenges.moneyPileChallenge.dropMoney.broadcast(ReplicatedStorage.Assets.Objects.LargeMoney);

		await countdown({
			seconds: 30,
		});

		task.wait(5000);
	}

	private SetupPlatforms() {
		this.platforms.forEach((platform) => {
			const buzz = ReplicatedStorage.Assets.Sounds.Buzz.Clone();
			buzz.Parent = platform.Part;
		});
	}

	private SetupFloor() {
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
			floorConnection.Disconnect();
			this.EliminatePlatform(data);
		});
		this.obliterator.Add(floorConnection, "Disconnect");
	}

	private CreateForcefield(platform: TPlatform) {
		const forcefield = createForcefield({
			cframe: platform.Part.CFrame.mul(new CFrame(0, 10.3 + platform.Part.Size.Y / 2, 0)),
			size: new Vector3(platform.Part.Size.X, 20, platform.Part.Size.Z),
			color: new Vector3(0, 255, 0),
		});
		forcefield.Parent = platform;
		return forcefield;
	}

	private EliminatePlatform({ platform, players }: PlatformData) {
		players.forEach((eP) => this.players.remove(this.players.findIndex((p) => p === eP)));
		platform.Lights.Color = Color3.fromRGB(255, 0, 0);
		platform.Lights.PointLight.Color = Color3.fromRGB(255, 0, 0);
		(platform.Part.FindFirstChild("Buzz") as Sound)?.Play();
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
			.CFrame.mul(new CFrame(0, platform.Part.Size.Y / 2 + 3, 0));
	}
}
