import { OnStart, Service } from "@flamework/core";
import { MarketplaceService, Players, Workspace } from "@rbxts/services";

@Service()
export class ProductService implements OnStart {
	public static devProducts = {
		BecomeMrBeast: 1936810825,
	} as const;
	private handlers: Record<
		(typeof ProductService.devProducts)[keyof typeof ProductService.devProducts],
		(receiptInfo: ReceiptInfo, player: Player) => void
	> = {
		[ProductService.devProducts.BecomeMrBeast]: (receiptInfo, player) => {
			print(`${player} purchased product: ${receiptInfo.ProductId}`);
		},
	};

	onStart() {
		MarketplaceService.ProcessReceipt = (r) => this.ProcessReceipt(r);
	}

	ProcessReceipt(receiptInfo: ReceiptInfo) {
		const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);

		if (player) {
			const handler = this.handlers[tostring(receiptInfo.ProductId) as unknown as keyof typeof this.handlers];
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

	public static PromptPurchase(player: Player, devProductName: keyof typeof ProductService.devProducts) {
		MarketplaceService.PromptProductPurchase(player, ProductService.devProducts[devProductName]);
	}
}
