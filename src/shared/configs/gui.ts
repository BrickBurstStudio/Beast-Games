export const GUI_PAGES = ["Inventory", "Shop", "Achievements", "Trading", "Settings"] as const;
export type GuiPage = (typeof GUI_PAGES)[number];

export const COLORS = {
	Primary: Color3.fromRGB(0, 163, 255),
	Secondary: Color3.fromRGB(0, 137, 215),

	Buttons: {
		Off: Color3.fromRGB(232, 70, 70),
		On: Color3.fromRGB(61, 220, 68),
	},

	Border: Color3.fromHSV(0, 0, 0.2),
	White: Color3.fromRGB(255, 255, 255),
};

export const BORDER_THICKNESS = 7.5;

export const IMAGES = {
	coins: "15416676802",
	gems: "15416675953",
	settings: "16545611198",
	shop: "9405933234",
} as const;

export type ImageName = keyof typeof IMAGES;
