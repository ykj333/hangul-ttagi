import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
const appRoot = path.resolve(import.meta.dirname, "..");
const nextCli = path.join(appRoot, "node_modules/next/dist/bin/next");
let base = process.env.TEST_URL ?? "";
let server;
before(async () => {
	if (base) return;
	if (!existsSync(path.join(appRoot, ".next/BUILD_ID"))) {
		await new Promise((resolve, reject) => {
			const build = spawn(process.execPath, [nextCli, "build", "--webpack"], {
				cwd: appRoot,
				stdio: "ignore",
			});
			build.on("error", reject);
			build.on("exit", (code) =>
				code === 0
					? resolve()
					: reject(
							new Error(
								"Test production build failed. Run npm run build for details.",
							),
						),
			);
		});
	}
	await new Promise((resolve, reject) => {
		server = spawn(process.execPath, [nextCli, "start", "--port", "0"], {
			cwd: appRoot,
			stdio: ["ignore", "pipe", "pipe"],
		});
		let output = "";
		const timeout = setTimeout(() => {
			server?.kill();
			reject(new Error("Test server did not become ready."));
		}, 30000);
		server.on("error", (error) => {
			clearTimeout(timeout);
			reject(error);
		});
		server.stdout.on("data", (chunk) => {
			output += chunk.toString();
			const match = output.match(/http:\/\/localhost:(\d+)/);
			if (match) base = `http://127.0.0.1:${match[1]}`;
			if (base && /Ready in/.test(output)) {
				clearTimeout(timeout);
				resolve();
			}
		});
		server.on("exit", (code) => {
			if (!base) {
				clearTimeout(timeout);
				reject(new Error(`Test server exited (${code}).`));
			}
		});
	});
});
after(() => server?.kill());
const sources = JSON.parse(
	await readFile(new URL("../data/sources.json", import.meta.url), "utf8"),
);
test("import preserves all 13 original documents byte for byte", async () => {
	// Given: the user-provided local source folder and imported corpus.
	assert.equal(sources.length, 13);
	// When: each original is compared with its imported representation.
	for (const source of sources) {
		const original = await readFile(
			new URL(`../../${source.relativePath}`, import.meta.url),
		);
		// Then: raw content, byte length and hash agree, including source errors.
		assert.equal(source.content, original.toString("utf8"));
		assert.equal(source.bytes, original.length);
		assert.equal(
			source.sha256,
			createHash("sha256").update(original).digest("hex"),
		);
	}
});
test("all five source areas and unique document identifiers are available", () => {
	// Given: imported source metadata. When: routing identities are enumerated.
	const ids = sources.map((s) => s.id);
	const areas = new Set(sources.map((s) => s.domain));
	// Then: no source can shadow another and every requested domain is present.
	assert.equal(new Set(ids).size, 13);
	assert.deepEqual([...areas].sort(), [
		"arts",
		"language",
		"nature",
		"physical",
		"social",
	]);
});
test("full text search combines domain filtering with body matches", async () => {
	// Given: a theory occurring in the social-relation body text.
	const url = `${base}/api/sources?domain=social&q=${encodeURIComponent("Vygotsky")}`;
	// When: the live search endpoint is used.
	const response = await fetch(url);
	const data = await response.json();
	// Then: body matches are returned only from that domain, with readable context.
	assert.equal(response.status, 200);
	assert.ok(data.sources.length > 0);
	for (const source of data.sources) {
		assert.equal(source.domain, "social");
		assert.match(source.snippet, /Vygotsky/i);
	}
});
test("invalid source, filter and excessive query receive explicit errors", async () => {
	// Given: malformed request boundaries. When: the actual routes are called.
	const results = await Promise.all(
		[
			"/api/sources/no-such-document",
			"/api/sources?domain=unknown",
			"/api/sources?q=" + "a".repeat(121),
		].map((p) => fetch(base + p)),
	);
	// Then: not-found and invalid-input statuses are distinct.
	assert.deepEqual(
		results.map((r) => r.status),
		[404, 400, 400],
	);
});
test("download returns exact source content and safe Unicode filename headers", async () => {
	// Given: one document from every domain. When: the live download endpoint is requested.
	for (const domain of ["physical", "social", "arts", "language", "nature"]) {
		const source = sources.find((s) => s.domain === domain);
		const response = await fetch(`${base}/api/sources/${source.id}?download=1`);
		const content = await response.text();
		// Then: no reformatting or truncation occurs and it is delivered as an attachment.
		assert.equal(response.status, 200);
		assert.equal(content, source.content);
		assert.match(
			response.headers.get("content-disposition"),
			/attachment;.*filename\*=UTF-8''/,
		);
		assert.match(response.headers.get("content-type"), /text\/markdown/);
	}
});
