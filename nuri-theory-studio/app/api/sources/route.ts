import sources from "@/data/sources.json";
import { z } from "zod";
const querySchema = z.object({
	q: z.string().max(120).default(""),
	domain: z
		.enum(["all", "physical", "social", "arts", "language", "nature"])
		.default("all"),
});
export async function GET(request: Request) {
	const url = new URL(request.url);
	const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
	if (!parsed.success)
		return Response.json(
			{ error: "검색어는 120자 이내로 입력하세요." },
			{ status: 400 },
		);
	const { q, domain } = parsed.data;
	const terms = q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
	const matches = sources
		.filter(
			(s) =>
				(domain === "all" || s.domain === domain) &&
				terms.every((t) =>
					(s.title + " " + s.content).toLocaleLowerCase().includes(t),
				),
		)
		.map(({ content, ...meta }) => {
			const first = terms.length
				? content.toLocaleLowerCase().indexOf(terms[0])
				: -1;
			return {
				...meta,
				snippet:
					first >= 0
						? content
								.slice(Math.max(0, first - 90), first + 240)
								.replace(/[#*_`]/g, "")
						: "",
			};
		});
	return Response.json(
		{ sources: matches },
		{ headers: { "Cache-Control": "public, max-age=300" } },
	);
}
