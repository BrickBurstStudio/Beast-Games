export const CHALLENGE_NAMES = [
	"Boulder Pull",
	"Bribe",
	"Knockoff Knockout",
	"Platform",
	"Pugil",
	"Gold Rush",
	"Flag Run",
	"Briefcase Memory",
] as const;
export type ChallengeName = (typeof CHALLENGE_NAMES)[number];

export const GUI_PAGES = ["Inventory", "Shop", "Achievements", "Trading", "Settings"] as const;
export type GuiPage = (typeof GUI_PAGES)[number];

export const COLORS = {
	Primary: Color3.fromRGB(0, 163, 255),
	Secondary: Color3.fromRGB(0, 107, 171),

	Buttons: {
		Off: Color3.fromRGB(232, 70, 70),
		On: Color3.fromRGB(61, 220, 68),
	},

	Border: Color3.fromHSV(0, 0, 0.2),
	White: Color3.fromRGB(255, 255, 255),
};

export const BORDER_THICKNESS = 7.5;
