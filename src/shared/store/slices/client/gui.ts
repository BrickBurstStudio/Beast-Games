import { createProducer } from "@rbxts/reflex";
import { ChallengeName, GuiPage } from "shared/configs/gui";

export interface GuiState {
	guiPage?: GuiPage;
	toolTip?: ToolTip;
	challenge?: ChallengeName;
}

export interface ToolTip {
	header: string;
	body?: string;
}

const initalState: GuiState = {};

export const guiSlice = createProducer(initalState, {
	setGuiPage: (state, page?: GuiPage) => ({
		...state,
		guiPage: page,
	}),
	setToolTip: (state, tooltip?: ToolTip) => ({
		...state,
		toolTip: tooltip,
	}),
	setChallenge: (state, challenge?: ChallengeName) => ({
		...state,
		challenge: challenge,
	}),
});
