import { DataStoreService, Players, RunService } from "@rbxts/services";
import { getPlayerMultiplier } from "shared/utils/functions/getPlayerMultiplier";

let DataStoreName = "Production";
if (RunService.IsStudio()) DataStoreName = "Testing";

export class BaseOrderedDataStore {
	private player: Player;
	protected playerKey: string;
	private orderedDataStore: OrderedDataStore;
	private stateCallback: (amount: number) => void;
	private playerMultiplier: boolean;

	constructor(
		player: Player,
		orderedDataStoreName: string,
		stateCallback: (amount: number) => void,
		playerMultiplier: boolean = false,
	) {
		if (player.UserId < 0)
			warn("Invalid playerID, dont use multitest in studio. (Player1 = -1), (Player2 = -2), etc.");
		orderedDataStoreName = orderedDataStoreName + "_" + DataStoreName;
		this.player = player;
		this.playerKey = `Player_${player.UserId}`;
		this.playerMultiplier = playerMultiplier;
		this.orderedDataStore = DataStoreService.GetOrderedDataStore(orderedDataStoreName);
		this.stateCallback = stateCallback;
	}

	UpdateBy(amount: number) {
		if (amount > 0 && this.playerMultiplier) amount *= getPlayerMultiplier(this.player);

		BaseOrderedDataStore.SafeCall(
			() => {
				this.orderedDataStore.IncrementAsync(this.playerKey, amount);
				this.stateCallback(amount);
			},
			Enum.DataStoreRequestType.SetIncrementAsync,
			this.player.UserId,
		);
	}

	Get() {
		const value = BaseOrderedDataStore.SafeCall<number | undefined>(
			() => {
				return this.orderedDataStore.GetAsync(this.playerKey);
			},
			Enum.DataStoreRequestType.GetAsync,
			this.player.UserId,
		);
		if (value === undefined) {
			this.orderedDataStore.SetAsync(this.playerKey, 0);
			return 0;
		}
		return value;
	}

	static GetTop(top: number, orderedDataStoreName: string) {
		orderedDataStoreName = orderedDataStoreName + "_" + DataStoreName;
		if (top > 100) error("Must implement AdvanceToNextPageAsync"); // atm, no use case for page iteration

		const pages = BaseOrderedDataStore.SafeCall<DataStorePages | undefined>(() => {
			return DataStoreService.GetOrderedDataStore(orderedDataStoreName).GetSortedAsync(false, top);
		}, Enum.DataStoreRequestType.GetSortedAsync);

		if (pages === undefined) {
			warn(`Pages for DataStore ${orderedDataStoreName} cant be fetched!`);
			return [];
		}

		return pages.GetCurrentPage() as unknown as {
			key: string;
			value: number;
		}[];
	}

	static Reset(orderedDataStoreName: string) {
		orderedDataStoreName = orderedDataStoreName + "_" + DataStoreName;
		DataStoreService.GetOrderedDataStore(orderedDataStoreName)
			.GetSortedAsync(false, 100)
			.GetCurrentPage()
			.forEach((entry) => {
				print("Removing entry", entry);
				DataStoreService.GetOrderedDataStore(orderedDataStoreName).RemoveAsync(entry.key);
			});
	}

	protected static SafeCall<T>(
		func: () => T,
		requestType: Enum.DataStoreRequestType,
		playerID?: number,
		tries: number = 0,
		maxRetryAttempts: number = 4,
	): T | void {
		if (playerID) {
			if (!Players.GetPlayerByUserId(playerID)) return print(playerID + " has left");
			if (tries >= maxRetryAttempts) return print("Max retries reached");
		}

		BaseOrderedDataStore.YieldRequestBudget(requestType);
		try {
			// underscore is necessary btw
			const _ = func();
			return _;
		} catch (e) {
			warn(e);
			return BaseOrderedDataStore.SafeCall(func, requestType, playerID, tries + 1, maxRetryAttempts);
		}
	}

	private static YieldRequestBudget(requestType: Enum.DataStoreRequestType) {
		let budget = DataStoreService.GetRequestBudgetForRequestType(requestType);
		while (budget < 1) {
			budget = DataStoreService.GetRequestBudgetForRequestType(requestType);
			task.wait(5);
		}
	}
}
