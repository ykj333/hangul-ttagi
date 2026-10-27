// Build-time authoring only. The key is read in memory from the base folder and never deployed.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
const raw = (
	await readFile(
		path.resolve(import.meta.dirname, "../../gemini_api_key.txt"),
		"utf8",
	)
).trim();
const key = raw
	.replace(/^GEMINI_API_KEY\s*=\s*/, "")
	.replace(/^["']|["']$/g, "");
const prompt =
	"Create an original editorial colored-pencil and watercolor line drawing for a Korean early-childhood teacher research dashboard. Warm ivory paper background #f4f2e8. A thoughtful tabletop still-life with FIVE connected learning vignettes: a small balancing stepping-stone path and soft ball; two friendly wooden person figures sharing blocks; paintbrushes, pastel crayons and a small tambourine; an open picture book with a tiny speech bubble shape; a potted sprout, magnifying glass and smooth leaves. Integrate all five into one beautiful coherent airy horizontal composition, like a refined pedagogical field notebook. Sage green, burnt ochre, dusty coral, muted lavender and blue. Delicate hand-drawn pencil contours, tactile watercolor washes, gentle realistic shadows, lots of negative space, not 3D, not vector clipart, not childish emoji, no people faces, no typography, no letters, no numbers, no logos. All objects large and legible.";
const response = await fetch(
	"https://generativelanguage.googleapis.com/v1beta/interactions",
	{
		method: "POST",
		headers: { "Content-Type": "application/json", "x-goog-api-key": key },
		body: JSON.stringify({
			model: "gemini-nano-banana-2.1",
			input: prompt,
			response_format: {
				type: "image",
				aspect_ratio: "16:9",
				image_size: "1K",
			},
		}),
		signal: AbortSignal.timeout(180000),
	},
);
const result = await response.json();
if (!response.ok) {
	console.log(
		JSON.stringify({
			status: response.status,
			error: result.error?.status ?? "GENERATION_FAILED",
		}),
	);
	process.exitCode = 1;
} else {
	const images = [];
	function collect(value) {
		if (!value || typeof value !== "object") return;
		if (
			typeof value.data === "string" &&
			(value.type === "image" || value.mime_type?.startsWith("image/"))
		)
			images.push(value);
		for (const child of Object.values(value))
			if (typeof child === "object") collect(child);
	}
	collect(result);
	if (!images.length) {
		await writeFile(
			path.resolve(import.meta.dirname, "../.generation-response.json"),
			JSON.stringify(result),
		);
		console.log(
			JSON.stringify({
				status: "no-inline-image",
				keys: Object.keys(result),
				id: result.id,
			}),
		);
		process.exitCode = 1;
	} else {
		await mkdir(path.resolve(import.meta.dirname, "../public"), {
			recursive: true,
		});
		await writeFile(
			path.resolve(import.meta.dirname, "../public/learning-table.png"),
			Buffer.from(images[0].data, "base64"),
		);
		await writeFile(
			path.resolve(import.meta.dirname, "../data/illustration.json"),
			JSON.stringify(
				{
					model: "gemini-nano-banana-2.1",
					purpose: "교재교구 연구를 위한 개념 드로잉",
					generatedAt: new Date().toISOString(),
				},
				null,
				2,
			),
		);
		console.log(
			JSON.stringify({
				status: "saved",
				file: "public/learning-table.png",
				model: "gemini-nano-banana-2.1",
			}),
		);
	}
}
