type PlatformT = Model & {
	Door1: Part;
	Door2: Part;
	Lighting: Model & {
		Union: UnionOperation;
		Part: Part & {
			SpotLight: SpotLight;
		};
	};
	Union: UnionOperation;
};
