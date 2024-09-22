import { createProducer } from "@rbxts/reflex";
import { GuiPage } from "shared/configs/gui";

export interface GuiState {
	guiPage?: GuiPage;
}

const initalState: GuiState = {};

export const guiSlice = createProducer(initalState, {
	setGuiPage: (state, page?: GuiPage) => ({
		...state,
		guiPage: page,
	}),
});
