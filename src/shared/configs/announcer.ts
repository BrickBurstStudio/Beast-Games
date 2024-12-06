import { RunService } from "@rbxts/services";

export const ANNOUNCER_CONFIGS = {
	animationTime: 0.5,
	keystrokeTime: 0.02,
	preMessageTime: 0.5,
	postMessageTime: 3,
} as const;

export const RICH_TEXT_COLORS = {
	blue: "#425df5",
	orange: "#de4710",
	green: "#00ff00",
	red: "#ff0000",
} as const;

export const RICH_TEXT_REPLACE = {
	eliminated: `<font color="${RICH_TEXT_COLORS.red}">replace</font>`,
	yourself: `<font color="${RICH_TEXT_COLORS.blue}">replace</font>`,
	you: `<font color="${RICH_TEXT_COLORS.blue}">replace</font>`,
	your: `<font color="${RICH_TEXT_COLORS.blue}">replace</font>`,
	everyone: `<font color="${RICH_TEXT_COLORS.orange}">replace</font>`,
	anyone: `<font color="${RICH_TEXT_COLORS.orange}">replace</font>`,
	first: `<font color="${RICH_TEXT_COLORS.green}">replace</font>`,
	bribe: `<font color="${RICH_TEXT_COLORS.green}">replace</font>`,
	money: `<font color="${RICH_TEXT_COLORS.green}">replace</font>`,
};

export const RULES_CONFIGS = {
	animationTime: 1,
	timePerRule: RunService.IsStudio() ? 0 : 4,
	timeAfterRules: RunService.IsStudio() ? 0 : 1,
} as const;
