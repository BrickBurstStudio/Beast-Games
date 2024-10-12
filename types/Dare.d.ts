import { Currency } from "shared/configs/currency";

export type Dare = {
	name: string;
	description: string;
	reward: Currency | "xp";
	targets: number;
};
