import React from "@rbxts/react";
import { MarketplaceService, Players } from "@rbxts/services";
import Modal from "client/ui/components/modal";
import { px } from "client/ui/utils/usePx";

const TOKEN_PACKAGES = [
	{ id: 2666228837, tokens: 1, price: 49 },
	{ id: 2666228957, tokens: 3, price: 129 },
	{ id: 2666229109, tokens: 5, price: 199 },
	{ id: 2666229264, tokens: 10, price: 349 },
	{ id: 2666229383, tokens: 25, price: 749 },
].map((pkg) => ({
	...pkg,
	pricePerToken: math.floor(pkg.price / pkg.tokens),
	savings: math.floor(((49 * pkg.tokens - pkg.price) / (49 * pkg.tokens)) * 100),
}));

export default function TokenPackagesModal({ onClose }: { onClose: () => void }) {
	return (
		<Modal
			height={px(TOKEN_PACKAGES.size() * 175 + 100)}
			title="Buy Tokens"
			onClose={onClose}
			children={TOKEN_PACKAGES.map((pkg) => (
				<frame key={pkg.id} Size={new UDim2(0.9, 0, 0, px(85))} BackgroundColor3={new Color3(0.2, 0.2, 0.2)}>
					<uicorner CornerRadius={new UDim(0, 6)} />
					<textbutton
						Text={`${pkg.tokens} Tokens - <font color="rgb(0,255,127)">R$${pkg.price}</font>
${pkg.tokens > 1 ? `<font color="rgb(200,200,200)"><font color="rgb(0,255,127)">R$${pkg.pricePerToken}</font>/token (${pkg.savings}% savings!)</font>` : ""}`}
						Size={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
						TextColor3={new Color3(1, 1, 1)}
						FontFace={Font.fromName("Gotham")}
						TextSize={16}
						RichText={true}
						Event={{
							MouseButton1Click: () => {
								MarketplaceService.PromptProductPurchase(Players.LocalPlayer, pkg.id);
							},
						}}
					/>
				</frame>
			))}
		/>
	);
}
