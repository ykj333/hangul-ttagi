import { z } from "zod";
import { Dashboard } from "@/components/Dashboard";
import sources from "@/data/source-index.json";
const viewSchema = z
	.enum(["overview", "domain", "lab", "library", "notes"])
	.catch("overview");
const domainSchema = z
	.enum(["physical", "social", "arts", "language", "nature"])
	.catch("physical");
export default async function Page({
	searchParams,
}: {
	readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const query = await searchParams;
	const view = viewSchema.parse(query.view);
	const active = domainSchema.parse(query.domain);
	return (
		<Dashboard sources={sources} view={view} active={active} hasIllustration />
	);
}
