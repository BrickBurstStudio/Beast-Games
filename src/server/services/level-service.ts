import { OnStart, Service } from "@flamework/core";
import { Functions } from "server/network";
import { store } from "server/store";
import { items } from "shared/configs/items";
import { cases } from "shared/configs/items/cases";
import { selectPlayerBalance } from "shared/store/selectors/players";

@Service()
export class LevelService implements OnStart {
	onStart() {
		
	}
}
