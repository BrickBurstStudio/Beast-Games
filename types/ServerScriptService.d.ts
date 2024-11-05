interface ServerScriptService extends Instance {
	TS: Folder & {
		challenges: Folder & {
			["money-pile.challenge"]: ModuleScript;
			["briefcase.challenge"]: ModuleScript;
			["boulder.challenge"]: ModuleScript;
			["base.challenge"]: ModuleScript;
			["flag.challenge"]: ModuleScript;
		};
		network: ModuleScript;
		services: Folder & {
			["level.service"]: ModuleScript;
			["shop.service"]: ModuleScript;
			["equip.service"]: ModuleScript;
			["player-data.service"]: ModuleScript;
			["title.service"]: ModuleScript;
			["leaderboard.service"]: ModuleScript;
			["game.service"]: ModuleScript;
			["login.service"]: ModuleScript;
			["product.service"]: ModuleScript;
			["case.service"]: ModuleScript;
		};
		classes: Folder & {
			BaseOrderedDataStore: ModuleScript;
			OrderedPlayerData: ModuleScript;
		};
		runtime: Script;
		store: ModuleScript & {
			middleware: Folder & {
				broadcaster: ModuleScript;
			};
		};
		util: Folder & {
			countdown: ModuleScript;
			getRandomItem: ModuleScript;
			createDare: ModuleScript;
			announce: ModuleScript;
			generatePlayerGrid: ModuleScript;
		};
		cmdr: Folder & {
			commands: Folder & {
				giveXP: ModuleScript;
				openCase: ModuleScript;
				resetData: ModuleScript;
				giveCurrencyServer: ModuleScript;
				printPlayerData: ModuleScript;
				announceServer: ModuleScript;
				resetDataServer: ModuleScript;
				printPlayerDataServer: ModuleScript;
				openCaseServer: ModuleScript;
				purchaseCaseServer: ModuleScript;
				giveXPServer: ModuleScript;
				purchaseCase: ModuleScript;
				giveCurrency: ModuleScript;
				announce: ModuleScript;
			};
			startup: Script;
			types: Folder & {
				currency: ModuleScript;
				playerData: ModuleScript;
				["case"]: ModuleScript;
			};
		};
		components: Folder & {
			["claim-components"]: Folder & {
				["claim.component"]: ModuleScript;
				["briefcase.component"]: ModuleScript;
				["flag-pole.component"]: ModuleScript;
				["money-pile.component"]: ModuleScript;
			};
		};
	};
}
