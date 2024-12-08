import { OnStart, Service } from "@flamework/core";
import { AnalyticsService, MarketplaceService, Players } from "@rbxts/services";
import { store } from "server/store";
import { selectPlayerBalance } from "shared/store/selectors/players";

@Service()
export class ProductService implements OnStart {
	public static devProducts = {
		Token1: 2666228837,
		Token3: 2666228957,
		Token5: 2666229109,
		Token10: 2666229264,
		Token25: 2666229383,
	} as const;
	private handlers: Record<
		(typeof ProductService.devProducts)[keyof typeof ProductService.devProducts],
		(receiptInfo: ReceiptInfo, player: Player) => void
	> = {
		[ProductService.devProducts.Token1]: (receiptInfo, player) => {
			store.changeBalance(tostring(player.UserId), "action_token", 1);
			const currentActionTokens = store.getState(selectPlayerBalance(tostring(player.UserId), "action_token"));
			AnalyticsService.LogEconomyEvent(
				player,
				Enum.AnalyticsEconomyFlowType.Source,
				"action_token",
				1,
				currentActionTokens ?? 1,
				Enum.AnalyticsEconomyTransactionType.IAP.Name,
			);
		},
		[ProductService.devProducts.Token3]: (receiptInfo, player) => {
			store.changeBalance(tostring(player.UserId), "action_token", 3);
			const currentActionTokens = store.getState(selectPlayerBalance(tostring(player.UserId), "action_token"));
			AnalyticsService.LogEconomyEvent(
				player,
				Enum.AnalyticsEconomyFlowType.Source,
				"action_token",
				3,
				currentActionTokens ?? 3,
				Enum.AnalyticsEconomyTransactionType.IAP.Name,
			);
		},
		[ProductService.devProducts.Token5]: (receiptInfo, player) => {
			store.changeBalance(tostring(player.UserId), "action_token", 5);
			const currentActionTokens = store.getState(selectPlayerBalance(tostring(player.UserId), "action_token"));
			AnalyticsService.LogEconomyEvent(
				player,
				Enum.AnalyticsEconomyFlowType.Source,
				"action_token",
				5,
				currentActionTokens ?? 5,
				Enum.AnalyticsEconomyTransactionType.IAP.Name,
			);
		},
		[ProductService.devProducts.Token10]: (receiptInfo, player) => {
			store.changeBalance(tostring(player.UserId), "action_token", 10);
			const currentActionTokens = store.getState(selectPlayerBalance(tostring(player.UserId), "action_token"));
			AnalyticsService.LogEconomyEvent(
				player,
				Enum.AnalyticsEconomyFlowType.Source,
				"action_token",
				10,
				currentActionTokens ?? 10,
				Enum.AnalyticsEconomyTransactionType.IAP.Name,
			);
		},
		[ProductService.devProducts.Token25]: (receiptInfo, player) => {
			store.changeBalance(tostring(player.UserId), "action_token", 25);
			const currentActionTokens = store.getState(selectPlayerBalance(tostring(player.UserId), "action_token"));
			AnalyticsService.LogEconomyEvent(
				player,
				Enum.AnalyticsEconomyFlowType.Source,
				"action_token",
				25,
				currentActionTokens ?? 25,
				Enum.AnalyticsEconomyTransactionType.IAP.Name,
			);
		},
	};

	onStart() {
		MarketplaceService.ProcessReceipt = (r) => this.ProcessReceipt(r);
	}

	ProcessReceipt(receiptInfo: ReceiptInfo) {
		const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);

		if (player) {
			const handler = this.handlers[receiptInfo.ProductId as keyof typeof this.handlers];
			if (handler)
				try {
					handler(receiptInfo, player);
					return Enum.ProductPurchaseDecision.PurchaseGranted;
				} catch (error) {
					warn("Failed to process receipt:", receiptInfo, error);
				}
		}
		return Enum.ProductPurchaseDecision.NotProcessedYet;
	}
}
