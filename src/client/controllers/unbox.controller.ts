import { BaseComponent } from "@flamework/components";
import { Controller, OnStart } from "@flamework/core";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { Item, ItemRarityConfig } from "shared/configs/items";
import { getCharacter } from "shared/utils/functions/getCharacter";
import { tweenNumber, tweenScale } from "shared/utils/functions/tweenUtil";

@Controller()
export class UnboxComponent extends BaseComponent<{}, BasePart> implements OnStart {
	onStart() {
		Events.animateUnboxing.connect(({ targetPlayer, item }) => {
			this.Unbox({ player: targetPlayer, item });
		});
	}

	private async Unbox({ player, item }: { player: Player; item: Item }) {
		// Guards
		const unboxClone = ReplicatedStorage.Assets.Objects.Box.Clone();
		const itemClone = item.model.Clone();
		if (unboxClone.PrimaryPart === undefined) error("unboxModel's clone must have a PrimaryPart");
		if (itemClone.PrimaryPart === undefined) error("itemModel's clone must have a PrimaryPart");

		// Initialize
		const shakeSound = ReplicatedStorage.Assets.Sounds.BabyBoy.Clone();
		shakeSound.Parent = itemClone;

		const billboardClone = ReplicatedStorage.Assets.Gui.UnboxBGUI.Clone();
		const character = await getCharacter(player);
		unboxClone.Parent = Workspace;
		unboxClone.MoveTo(
			character.HumanoidRootPart.Position.add(
				character.HumanoidRootPart.CFrame.LookVector.mul(5).sub(new Vector3(0, 3, 0)),
			),
		);

		unboxClone.ScaleTo(0.001);
		itemClone.ScaleTo(0.001);
		itemClone.Parent = Workspace;
		itemClone.MoveTo(unboxClone.PrimaryPart.Position);

		const light = new Instance("PointLight", itemClone.PrimaryPart);
		light.Enabled = false;
		light.Brightness = 0;
		light.Shadows = true;

		// Animate
		const unboxSpin = TweenService.Create(
			unboxClone.PrimaryPart,
			new TweenInfo(1.5, Enum.EasingStyle.Elastic, Enum.EasingDirection.InOut, 2),
			{
				CFrame: unboxClone.PrimaryPart.CFrame.mul(CFrame.Angles(0, math.rad(180), 0)),
			},
		);
		const itemFloatSpin = TweenService.Create(
			itemClone.PrimaryPart,
			new TweenInfo(1, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out),
			{
				CFrame: unboxClone.PrimaryPart.CFrame.mul(CFrame.Angles(0, math.rad(180), 0).add(new Vector3(0, 5, 0))),
			},
		);

		await tweenScale(
			unboxClone.GetScale(),
			1,
			new TweenInfo(1, Enum.EasingStyle.Elastic, Enum.EasingDirection.Out),
			unboxClone,
		);
		unboxSpin.Play();
		task.spawn(() => {
			for (let i = 0; i < 3; i++) {
				task.wait(0.5);
				shakeSound.Play();
				task.wait(1);
			}
		});

		unboxSpin.Completed.Wait();
		await tweenScale(
			unboxClone.GetScale(),
			0.001,
			new TweenInfo(1, Enum.EasingStyle.Cubic, Enum.EasingDirection.In),
			unboxClone,
		);
		unboxClone.Destroy();

		const sound = ItemRarityConfig[item.rarity].sound.Clone();
		sound.Parent = itemClone.PrimaryPart;
		sound.Play();

		tweenScale(
			itemClone.GetScale(),
			1,
			new TweenInfo(1, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out),
			itemClone,
		);
		itemFloatSpin.Play();
		light.Enabled = true;
		tweenNumber(0, 8, new TweenInfo(2, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), (value: number) => {
			light.Brightness = value;
		});
		itemFloatSpin.Completed.Wait();

		// ! billboardClone setup needs to be here
		billboardClone.Parent = itemClone.PrimaryPart;
		billboardClone.Enabled = true;
		billboardClone.Adornee = itemClone.PrimaryPart;
		billboardClone.ItemName.Text = item.name;
		billboardClone.Rarity.Text = item.rarity.sub(1, 1).upper() + item.rarity.sub(2);
		billboardClone.Rarity.TextColor3 = ItemRarityConfig[item.rarity].color;

		TweenService.Create(
			itemClone.PrimaryPart,
			new TweenInfo(10, Enum.EasingStyle.Linear, Enum.EasingDirection.In),
			{
				CFrame: itemClone.PrimaryPart.CFrame.mul(CFrame.Angles(0, math.rad(100), 0)),
			},
		).Play();

		task.wait(4);

		tweenNumber(1, 0, new TweenInfo(1.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), (value: number) => {
			light.Brightness = value;
		});
		tweenNumber(3, 0, new TweenInfo(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), (value: number) => {
			if (value > 0.1) billboardClone.Size = UDim2.fromScale(value, 1);
		});
		await tweenScale(
			itemClone.GetScale(),
			0.01,
			new TweenInfo(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut),
			itemClone,
		);
		// itemClone.Destroy();
	}
}
