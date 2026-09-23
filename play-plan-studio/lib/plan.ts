export const sectionKeys = ["goal", "type", "support", "participation", "process", "reflection", "dialogue"] as const;
export type SectionKey = typeof sectionKeys[number];
export type Plan = { title: string; sections: Record<SectionKey, string> };
export type PlanInput = { age: string; title: string; context: string; playType: string };

export const sectionLabels: Record<SectionKey, string> = {
  goal: "놀이 목표",
  type: "놀이 유형",
  support: "놀이 촉진 및 교사 지원",
  participation: "유아 참여 · 교사 놀이지원 · 교사 역할",
  process: "놀이 활동 과정",
  reflection: "평가 관점 · 성찰 활동",
  dialogue: "교사와 유아의 상호작용 예시",
};

export function isPlan(value: unknown): value is Plan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Partial<Plan>;
  return typeof plan.title === "string" && !!plan.sections && sectionKeys.every((key) => typeof plan.sections?.[key] === "string");
}
