import { OnStart, Service } from "@flamework/core";
import { MarketplaceService, Players } from "@rbxts/services";
import { store } from "server/store";

@Service()
export class ProductService implements OnStart {
	public static devProducts = {
		BecomeMrBeast: 1936810825,
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
		[ProductService.devProducts.BecomeMrBeast]: (receiptInfo, player) => {
			print(`${player} purchased product: ${receiptInfo.ProductId}`);
		},
		[ProductService.devProducts.Token1]: (receiptInfo, player) => {
			store.addActionTokens(tostring(player.UserId), 1);
		},
		[ProductService.devProducts.Token3]: (receiptInfo, player) => {
			store.addActionTokens(tostring(player.UserId), 3);
		},
		[ProductService.devProducts.Token5]: (receiptInfo, player) => {
			store.addActionTokens(tostring(player.UserId), 5);
		},
		[ProductService.devProducts.Token10]: (receiptInfo, player) => {
			store.addActionTokens(tostring(player.UserId), 10);
		},
		[ProductService.devProducts.Token25]: (receiptInfo, player) => {
			store.addActionTokens(tostring(player.UserId), 25);
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
