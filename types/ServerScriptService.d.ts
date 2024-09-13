interface ServerScriptService extends Instance {
	TS: Folder & {
		runtime: Script;
		challenges: Folder & {
			["base-challenge"]: ModuleScript;
			["money-pile-challenge"]: ModuleScript;
			["briefcase-challenge"]: ModuleScript;
			["flag-challenge"]: ModuleScript;
			["boulder-challenge"]: ModuleScript;
		};
		network: ModuleScript;
		services: Folder & {
			["game-service"]: ModuleScript;
			PlayerDataService: ModuleScript;
		};
		BaseOrderedDataStore: ModuleScript;
		store: ModuleScript & {
			middleware: Folder & {
				broadcaster: ModuleScript;
			};
		};
		components: Folder & {
			["claim-components"]: Folder & {
				["flag-component"]: ModuleScript;
				["briefcase-component"]: ModuleScript;
				["money-pile-component"]: ModuleScript;
				["claim-component"]: ModuleScript;
			};
		};
		OrderedPlayerData: ModuleScript;
	};
}
