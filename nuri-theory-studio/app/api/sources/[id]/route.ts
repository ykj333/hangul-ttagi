import sources from "@/data/sources.json";
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const source = sources.find((s) => s.id === id);
	if (!source)
		return Response.json(
			{ error: "자료를 찾을 수 없습니다." },
			{ status: 404 },
		);
	if (new URL(request.url).searchParams.get("download") === "1")
		return new Response(source.content, {
			headers: {
				"Content-Type": "text/markdown; charset=utf-8",
				"Content-Disposition": `attachment; filename="${source.id}.md"; filename*=UTF-8''${encodeURIComponent(source.filename)}`,
				"X-Content-Type-Options": "nosniff",
			},
		});
	return Response.json(source, {
		headers: {
			"Cache-Control": "public, max-age=3600",
			"X-Content-Type-Options": "nosniff",
		},
	});
}
