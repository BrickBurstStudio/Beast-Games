import { SharedState } from "..";

export const selectGuiPage = (state: SharedState) => {
	return state.client.gui.guiPage;
};

export const selectToolTip = (state: SharedState) => {
	return state.client.gui.toolTip;
}