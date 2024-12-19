import { ReplicatedStorage } from "@rbxts/services";
import { Item } from ".";

export type Emote = { animation: Animation } & Item;

export const emotes = [
	{
		id: "emote_1",
		rarity: "uncommon",
		name: "Default Dance",
		animation: ReplicatedStorage.Assets.Animations.Emotes["Default Dance"],
		model: ReplicatedStorage.Assets.Objects.Kanye,
	},
	{
		id: "emote_2",
		rarity: "legendary",
		name: "Take The L",
		animation: ReplicatedStorage.Assets.Animations.Emotes["Take The L"],
		model: ReplicatedStorage.Assets.Objects.Kanye,
	},
	{
		id: "emote_3",
		rarity: "rare",
		name: "Loud Laugh",
		animation: ReplicatedStorage.Assets.Animations.Emotes["Loud Laugh"],
		model: ReplicatedStorage.Assets.Objects.Kanye,
	},
	{
		id: "emote_4",
		rarity: "epic",
		name: "Helicopter",
		animation: ReplicatedStorage.Assets.Animations.Emotes["Helicopter"],
		model: ReplicatedStorage.Assets.Objects.Kanye,
	},
	{
		id: "emote_5",
		rarity: "common",
		name: "T-Pose",
		animation: ReplicatedStorage.Assets.Animations.Emotes["T-Pose"],
		model: ReplicatedStorage.Assets.Objects.Kanye,
	},
	{
		id: "emote_6",
		rarity: "rare",
		name: "Clean Groove",
		animation: ReplicatedStorage.Assets.Animations.Emotes["Clean Groove"],
		model: ReplicatedStorage.Assets.Objects.Kanye,
	},
	{
		id: "emote_7",
		rarity: "epic",
		name: "Floss",
		animation: ReplicatedStorage.Assets.Animations.Emotes["Floss"],
		model: ReplicatedStorage.Assets.Objects.Kanye,
	},
] as const satisfies Emote[];

export function isEmote(item: Item): item is Emote {
	return "animation" in item;
}
