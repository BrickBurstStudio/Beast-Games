export type HonorTitle = {
	title: string;
	honor: number;
};

export const honorTitles = [
	{ title: "Psychopath", honor: -15 },
	{ title: "Selfish", honor: -10 },
	{ title: "Suspicious", honor: -5 },
	{ title: "Decent", honor: 0 },
	{ title: "Respected", honor: 5 },
	{ title: "Saint", honor: 10 },
	{ title: "God Like", honor: 15 },
] as const;

export function getHonorTitle(honor: number): (typeof honorTitles)[number]["title"] {
	let title: (typeof honorTitles)[number]["title"] = "Decent";

	for (const honorTitle of honorTitles) {
		if (honor >= honorTitle.honor) {
			title = honorTitle.title;
		}
	}

	return title;
}

/*
	<= -11 = Psychopath
	-10 to -6 = Selfish
	-5 to -1 = Suspicious
	0 to 4 = Decent
	5 to 9 = Respected
	10 to 14 = Saint
	>= 15 = God Like
*/