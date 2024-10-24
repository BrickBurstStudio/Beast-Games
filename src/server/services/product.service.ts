import { OnStart, Service } from "@flamework/core";
import { MarketplaceService, Players, Workspace } from "@rbxts/services";
import { store } from "server/store";
import { ActionId, deviousLicks, divine } from "shared/configs/action";

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
			if ([...divine, ...deviousLicks].some((action) => action.id === receiptInfo.ProductId))
				store.addActionTicket(tostring(player.UserId), receiptInfo.ProductId as ActionId);

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

	public static PromptPurchase(
		player: Player,
		productId: ActionId | (typeof ProductService.devProducts)[keyof typeof ProductService.devProducts],
	) {
		MarketplaceService.PromptProductPurchase(player, productId);
	}
}
