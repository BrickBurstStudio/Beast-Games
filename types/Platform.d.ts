type TPlatform = Model & {
	Part: Part;
	Lights: UnionOperation & {
		PointLight: PointLight;
	};
};
