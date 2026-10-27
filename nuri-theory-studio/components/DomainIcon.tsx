import {
	Activity,
	UsersRound,
	Palette,
	MessagesSquare,
	Sprout,
} from "lucide-react";
import type { DomainId } from "@/lib/types";
const icons = {
	physical: Activity,
	social: UsersRound,
	arts: Palette,
	language: MessagesSquare,
	nature: Sprout,
};
export function DomainIcon({
	id,
	size = 22,
}: {
	readonly id: DomainId;
	readonly size?: number;
}) {
	const Icon = icons[id];
	return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}
