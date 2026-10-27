export type DomainId = "physical" | "social" | "arts" | "language" | "nature";
export type Theory = {
	readonly title: string;
	readonly author: string;
	readonly concept: string;
	readonly implication: string;
	readonly example: string;
	readonly caution: string;
};
export type Material = {
	readonly name: string;
	readonly type: string;
	readonly mechanism: string;
	readonly making: string;
	readonly ai: string;
	readonly caution: string;
};
export type Activity = {
	readonly title: string;
	readonly category: string;
	readonly goal: string;
	readonly materials: string;
	readonly steps: readonly string[];
	readonly questions: readonly string[];
	readonly observe: string;
	readonly extend: string;
};
export type Domain = {
	readonly id: DomainId;
	readonly name: string;
	readonly short: string;
	readonly english: string;
	readonly color: string;
	readonly light: string;
	readonly description: string;
	readonly categories: readonly string[];
	readonly keywords: readonly string[];
	readonly theories: readonly Theory[];
	readonly materials: readonly Material[];
	readonly activities: readonly Activity[];
	readonly observations: readonly string[];
	readonly question: {
		readonly scenario: string;
		readonly options: readonly string[];
		readonly correct: number;
		readonly explanation: string;
	};
};
export type SourceMeta = {
	readonly id: string;
	readonly domain: string;
	readonly filename: string;
	readonly title: string;
	readonly relativePath: string;
	readonly bytes: number;
	readonly sha256: string;
	readonly kind: string;
	readonly headings: readonly {
		readonly id: string;
		readonly level: number;
		readonly title: string;
	}[];
};
export type View = "overview" | "domain" | "lab" | "library" | "notes";
