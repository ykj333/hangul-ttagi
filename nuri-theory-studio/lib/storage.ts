"use client";
import { useSyncExternalStore } from "react";
import { z } from "zod";
const schema = z.object({
	notes: z.record(z.string(), z.string().max(12000)),
	completed: z.array(z.string()),
	plans: z.record(z.string(), z.string()),
});
export type Notebook = z.infer<typeof schema>;
const key = "nuri-research-v1";
const empty: Notebook = { notes: {}, completed: [], plans: {} };
function subscribe(callback: () => void) {
	window.addEventListener("storage", callback);
	window.addEventListener("nuri-storage", callback);
	return () => {
		window.removeEventListener("storage", callback);
		window.removeEventListener("nuri-storage", callback);
	};
}
function snapshot() {
	try {
		return localStorage.getItem(key) ?? "";
	} catch (error) {
		if (error instanceof DOMException) return "";
		throw error;
	}
}
export function useNotebook() {
	const raw = useSyncExternalStore(subscribe, snapshot, () => "");
	let notebook = empty;
	try {
		const parsed = schema.safeParse(raw ? JSON.parse(raw) : empty);
		if (parsed.success) notebook = parsed.data;
	} catch (error) {
		if (!(error instanceof SyntaxError)) throw error;
	}
	function save(next: Notebook): boolean {
		try {
			localStorage.setItem(key, JSON.stringify(next));
			window.dispatchEvent(new Event("nuri-storage"));
			return true;
		} catch (error) {
			if (error instanceof DOMException) return false;
			throw error;
		}
	}
	return { notebook, save, ready: typeof window !== "undefined" };
}
export function downloadFile(
	filename: string,
	content: string,
	type = "text/plain;charset=utf-8",
) {
	const url = URL.createObjectURL(new Blob(["\uFEFF" + content], { type }));
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.append(link);
	link.click();
	link.remove();
	setTimeout(() => URL.revokeObjectURL(url), 3000);
}
