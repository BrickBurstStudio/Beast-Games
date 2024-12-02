import { SharedState } from "..";

export const selectGuiPage = (state: SharedState) => {
	return state.client.gui.guiPage;
};

export const selectChallenge = (state: SharedState) => {
	return state.client.gui.challenge;
};

export const selectToolTip = (state: SharedState) => {
	return state.client.gui.toolTip;
};

export const selectSpectating = (state: SharedState) => {
	return state.client.gui.spectating;
};

export const selectMessage = (state: SharedState) => {
	return state.client.gui.message;
};
