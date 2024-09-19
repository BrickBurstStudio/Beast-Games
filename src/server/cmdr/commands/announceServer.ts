import { CommandContext } from "@rbxts/cmdr";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Events } from "server/network";
import { Currency } from "shared/configs/currency";

export = function (context: CommandContext, message: string) {
	Events.announcer.announce.broadcast([message]);
	return "Announcement sent.";
};
