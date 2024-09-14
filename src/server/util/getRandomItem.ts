import { ItemRarityConfig, items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";

export function chooseRandomItem(caseObject: (typeof cases)[number]) {
	// const weights = caseObject.items.map((id) => [id, ]);
	const weights = caseObject.items.map((itemId) => ({
		itemId,
		weight: ItemRarityConfig[items.get(itemId)!.rarity].weight,
	}));
	let totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);

	const chance = math.floor(math.random() * totalWeight) + 1;
	let counter = 0;

	for (const { itemId, weight } of weights) {
		counter += weight;
		if (chance <= counter) {
			return itemId;
		}
	}

	return weights[weights.size() - 1].itemId;
}

export function calculateUnboxChance(caseObject: (typeof cases)[number]) {
	const weights = caseObject.items.map((itemId) => ({
		itemId,
		weight: ItemRarityConfig[items.get(itemId)!.rarity].weight,
	}));
	let totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
	return weights.map((idWeight) => ({ id: idWeight.itemId, percentage: idWeight.weight / totalWeight }));
}
