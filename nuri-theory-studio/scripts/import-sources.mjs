import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const root = path.resolve(import.meta.dirname, "../..");
const groups = [
	["physical", "신체운동, 건강 영역"],
	["social", "사회관계 영역"],
	["arts", "예술경험 영역"],
	["language", "의사소통 영역"],
	["nature", "자연탐구 영역"],
];
const sources = [];
for (const [domain, folder] of groups) {
	const files = (await readdir(path.join(root, "AI Theory", folder)))
		.filter((f) => f.endsWith(".md"))
		.sort();
	for (const [index, filename] of files.entries()) {
		const buffer = await readFile(
			path.join(root, "AI Theory", folder, filename),
		);
		const content = buffer.toString("utf8");
		const headings = [...content.matchAll(/^(#{1,4})\s+(.+)$/gm)].map(
			(m, index) => ({
				id: `section-${index}`,
				level: m[1].length,
				title: m[2].replace(/\*\*/g, ""),
			}),
		);
		sources.push({
			id: `${domain}-${index + 1}`,
			domain,
			filename,
			title:
				headings.find((h) => h.level === 1)?.title ??
				filename.replace(".md", ""),
			relativePath: `AI Theory/${folder}/${filename}`,
			bytes: buffer.length,
			sha256: createHash("sha256").update(buffer).digest("hex"),
			kind: /AI|ai_|insights/i.test(filename) ? "ai" : "general",
			headings,
			content,
		});
	}
}
await mkdir(path.resolve(import.meta.dirname, "../data"), { recursive: true });
await writeFile(
	path.resolve(import.meta.dirname, "../data/sources.json"),
	JSON.stringify(sources),
);
await writeFile(
	path.resolve(import.meta.dirname, "../data/source-index.json"),
	JSON.stringify(
		sources.map((source) => {
			const metadata = { ...source };
			delete metadata.content;
			return metadata;
		}),
		null,
		2,
	),
);
console.log(
	JSON.stringify({
		documents: sources.length,
		bytes: sources.reduce((n, s) => n + s.bytes, 0),
		headings: sources.reduce((n, s) => n + s.headings.length, 0),
		domains: groups.map((g) => g[0]),
	}),
);
