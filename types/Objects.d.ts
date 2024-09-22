type Objects = Folder & {
	BriefcaseStand: Model & {
		Part: Part;
		Primary: Part;
	};
	Briefcase: Model & {
		Part: Part & {
			Mesh: SpecialMesh;
			BillboardGui: BillboardGui & {
				TextLabel: TextLabel;
			};
		};
	};
	MoneyPile: Model & {
		Part: Part;
		Dollars: NumberValue;
	};
	FlagPole: Model & {
		Flag: Part;
		WeldConstraint: WeldConstraint;
		Pole: Part;
	};
}
