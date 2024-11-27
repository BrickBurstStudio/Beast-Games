import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { FormatStandard } from "@rbxts/format-number";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { CollectionService, Players, ReplicatedStorage, ServerStorage, Workspace } from "@rbxts/services";
import { MoneyPileComponent } from "server/components/claim-components/money-pile.component";
import { announce } from "server/util/announce";
import { countdown } from "server/util/countdown";
import createForcefield from "shared/utils/functions/createForcefield";
import { BaseChallenge } from "./base.challenge";
type PlatformData = { eliminated: boolean; players: Player[]; platform: TPlatform };

export class MoneyPileChallenge extends BaseChallenge {
	protected readonly challengeName = "Money Pile";
	protected readonly rules = [
		"You will be assigned a random platform.",
		"The platform with the least amount of players will be eliminated!",
		"If there is a tie, both platforms will be eliminated!",
	];

	protected readonly map = ServerStorage.ChallengeMaps.MoneyPileChallenge.Clone();
	readonly platforms = this.map.Platforms.GetChildren() as TPlatform[];
	readonly floorTag = "stadium-floor" as const;
	private platformData: PlatformData[] = [];
	private currentMoneyPile: Model | undefined;
	private currentMoneyPileComponent: MoneyPileComponent | undefined;
	private forcefields: Part[] = [];

	private components = Dependency<Components>();

	protected async main() {
		this.forcefields = this.platforms.map((platform) => this.CreateForcefield(platform));
		this.ToggleForcefields(true);

		this.SetupPlatforms();
		this.SetupFloor();

		// await announce([
		// 	"Right now, there is a barrier preventing you from leaving your platform.",
		// 	"A pile of money will spawn in the center.",
		// 	"The first person to touch the money pile will receive the cash reward.",
		// 	"However, if you or anyone else on your platform leaves, everyone on your platform will be eliminated.",
		// 	"Stay on your platform to survive, or eliminate your entire platform to go for the money? You decide.",
		// ]);

		// todo: implement second countdown in the actual description text

		for (const model of [
			ReplicatedStorage.Assets.Objects.SmallMoney,
			ReplicatedStorage.Assets.Objects.MediumMoney,
			ReplicatedStorage.Assets.Objects.LargeMoney,
		]) {
			this.SpawnMoneyPile(model);

			await countdown({
				seconds: 5,
				description: "Removing barrier",
			});
			this.ToggleForcefields(false);

			await countdown({
				seconds: 15,
			});
			if (this.GameIsOver()) break;

			this.ToggleForcefields(true);

			if (this.currentMoneyPileComponent?.attributes.owner !== undefined) {
				await announce([
					`${this.currentMoneyPileComponent.attributes.owner} has won $${FormatStandard(model.PrimaryPart!.FindFirstChildOfClass("NumberValue")?.Value ?? 0)}!`,
				]);
			} else {
				await announce(["No one has claimed the money pile."]);
			}

			if (this.GameIsOver()) break;
		}
	}

	private GameIsOver() {
		if (this.platformData.some((pd) => pd.eliminated)) {
			this.platformData.forEach((pd) => pd.players.forEach((p) => this.EliminatePlayer(p)));
			return true;
		}
		return false;
	}

	private ToggleForcefields(toggle: boolean) {
		this.forcefields.forEach((forcefield) => {
			let shouldToggle = toggle;
			if (forcefield.Parent?.GetAttribute("eliminated")) shouldToggle = false;

			forcefield.Transparency = shouldToggle ? 0 : 1;
			forcefield.GetChildren().forEach((child) => {
				if (child.IsA("Part")) {
					child.CanCollide = shouldToggle;
				}
			});
		});
		if (!toggle) ReplicatedStorage.Assets.Sounds.Boom.Play();
	}

	private SpawnMoneyPile(model: Model) {
		this.currentMoneyPile?.Destroy();

		this.currentMoneyPile = model.Clone();
		this.currentMoneyPile.Parent = Workspace;
		this.currentMoneyPile.PivotTo(
			Workspace.Stadium.Center.CFrame.mul(new CFrame(0, model.PrimaryPart!.Size.Y / 2, 0)),
		);

		const moneyBGUI = ReplicatedStorage.Assets.Gui.DollarBGUI.Clone();
		moneyBGUI.Parent = this.currentMoneyPile.PrimaryPart;
		moneyBGUI.StudsOffset = new Vector3(0, this.currentMoneyPile.PrimaryPart!.Size.Y, 0);
		moneyBGUI.Size = UDim2.fromScale(
			this.currentMoneyPile.PrimaryPart!.Size.Magnitude,
			this.currentMoneyPile.PrimaryPart!.Size.Y,
		);
		moneyBGUI.TextLabel.Text = `$${FormatStandard(model.PrimaryPart!.FindFirstChildOfClass("NumberValue")?.Value ?? 0)}`;

		this.currentMoneyPileComponent = this.components.getComponent(this.currentMoneyPile, MoneyPileComponent);
		if (!this.currentMoneyPileComponent) return;

		this.currentMoneyPileComponent.claimedEvent.Event.Connect((player: Player) => {
			const index = this.platformData.findIndex((pd) => !!pd.players.find((p) => p === player));
			if (index === -1) return;
			this.EliminatePlatform(index);
		});
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
			if (!this.playersInChallenge.find((p) => p.Name === t.Parent?.Name)) return;
			const player = Players.GetPlayerFromCharacter(t.Parent);
			if (!player) return;
			const index = this.platformData.findIndex((pd) => !!pd.players.find((p) => p === player));
			if (index === -1) return;

			floorConnection.Disconnect();
			this.EliminatePlatform(index);
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

	private EliminatePlatform(index: number) {
		const { players, platform, eliminated } = this.platformData[index];
		if (eliminated) return;
		this.platformData[index].eliminated = true;
		players.forEach((eP) => this.playersInChallenge.remove(this.playersInChallenge.findIndex((p) => p === eP)));
		platform.SetAttribute("eliminated", true);
		platform.Lights.Color = Color3.fromRGB(255, 0, 0);
		platform.Lights.PointLight.Color = Color3.fromRGB(255, 0, 0);
		(platform.Part.FindFirstChild("Buzz") as Sound)?.Play();
	}

	protected spawnCharacter({ player, character, i }: { player: Player; character: CharacterRigR6; i: number }) {
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
