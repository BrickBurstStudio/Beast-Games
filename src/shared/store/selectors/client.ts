import { SharedState } from "..";

export const selectGuiPage = (state: SharedState) => {
	return state.client.gui.guiPage;
};
