import { createProducer } from "@rbxts/reflex";
import { GuiPage } from "shared/configs/gui";

export interface GuiState {
	guiPage?: GuiPage;
	toolTip?: ToolTip;
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
});
