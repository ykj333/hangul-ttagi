import { physical } from "./physical";
import { social } from "./social";
import { arts } from "./arts";
import { language } from "./language";
import { nature } from "./nature";
import type { Domain } from "@/lib/types";
export const domains: readonly Domain[] = [
	physical,
	social,
	arts,
	language,
	nature,
];
export const curriculumUrl =
	"https://i-nuri.go.kr/teacher/board/view.do?board_idx=860&data_type=normal&manage_idx=24&menu_idx=19";
