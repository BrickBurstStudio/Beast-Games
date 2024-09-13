import { SETTINGS } from "shared/configs/Settings";
import { PlayerData, PlayerSettings } from "./types";

let settings = {} as PlayerSettings;
SETTINGS.forEach((setting) => {
  settings[setting] = false;
});

export const defaultPlayerData: PlayerData = {
  equipped: {
    outfitId: undefined,
  },
  loggedIn: {
    last: undefined,
    total: 0,
  },
  balance: {
    coins: 0,
    gems: 0,
  },
  settings,
  items: [],
};
